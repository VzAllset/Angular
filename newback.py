from __future__ import print_function

from datetime import datetime
import json
import urllib
import boto3
import zlib
import ast

print('Loading function')

s3 = boto3.client('s3')
sns = boto3.client('sns')
dynamo = boto3.client('dynamodb')

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    # Get the object from the event and show its content type
    #bucket = event['Records'][0]['s3']['bucket']['name']
    #key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))
    bucket = 'verizon--cloudtrail-logs'
    key = 'AWSLogs/476522037579/CloudTrail/us-east-2/2017/06/16/476522037579_CloudTrail_us-east-2_20170616T1035Z_F66BHsMWPiTY4sId.json.gz'    
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        event_time_utc = response['LastModified'].strftime("%B %d, %Y")
            
        print("Cloud Trail Time: " + event_time_utc)
        dec = zlib.decompressobj(32 + zlib.MAX_WBITS)
        logJson = dec.decompress(response['Body'].read())
        print("JSON " + logJson)
        cloudtrail_data = json.loads(logJson)
        if ('Records' in cloudtrail_data):
            for trail_item in cloudtrail_data['Records']:
                if (trail_item['eventName'] == 'CreateVolume' and trail_item['requestParameters']['encrypted'] == False):
                    send_message_for_bad_ebs(trail_item)
                elif ( trail_item['eventName'] == 'CreateDBInstance' and trail_item['responseElements']['storageEncrypted'] == False ):
                    semd_message_for_bad_rds(trail_item)
                elif ( trail_item['eventName'] == 'AuthorizeSecurityGroupIngress' and has_non_standard_port(trail_item)):
                    send_message_for_bad_sg(trail_item)
                elif ( trail_item['eventName'] == 'PutBucketAcl' and check_bucket_acl(trail_item)):
                    send_message_for_bad_bucket_acl(trail_item)
                elif (trail_item['eventName'] == 'PutObject' and trail_item['requestParameters']['x-amz-server-side-encryption'] == 'AES256'):
                    send_message_for_bad_upload(trail_item)
        return response['ContentType']
    except Exception as e:
        print(e)
        
def push_to_sns(message):
    response = sns.publish(
    TargetArn='arn:aws:sns:us-east-2:476522037579:Publish_Security_Events',
    Message=message
    )

def send_event_to_dynamo(event_type, event_id, event):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
    table = dynamodb.Table('security_incidents')
    EventType= event_type
    EventId = event_id
    response = table.put_item(
        Item={
            'resource_id': EventId,
            'event_name': EventType,
            'event_time':event['eventTime'],
            'user_indentity': event['userIdentity'],
            'event_source':event['eventSource'],
            'info': event
        }
    )


def unicode_to_dict(unicode_value):
    return ast.literal_eval(unicode_value)

def send_message_for_bad_ebs(logItem):
    message = 'EBS Volume created unencrypted. Volume Id: ' + logItem['responseElements']['volumeId']
    send_event_to_dynamo(logItem['eventName'], logItem['responseElements']['volumeId'],logItem)
    push_to_sns(message)

def semd_message_for_bad_rds(logItem):
    message = 'RDS instance created without storage encryption. DB Instance ARN: ' + logItem['responseElements']['dBInstanceArn']
    send_event_to_dynamo(logItem['eventName'], logItem['responseElements']['dBInstanceArn'],logItem)
    push_to_sns(message)

def send_message_for_bad_sg(logItem):
    message = 'Security group with non standard ingress port created. Security Group ID: ' + logItem['requestParameters']['groupId']
    send_event_to_dynamo(logItem['eventName'], logItem['requestParameters']['groupId'],logItem)
    push_to_sns(message)

def send_message_for_bad_bucket_acl(logItem):
    message = 'S3 Bucket with global access created/updated. Bucketname: ' + logItem['requestParameters']['bucketName']
    send_event_to_dynamo(logItem['eventName'], logItem['requestParameters']['key'],logItem)
    push_to_sns(message)

def send_message_for_bad_upload(logItem):
    message = 'Unencrypted upload detected in s3 bucket. Bucketname: ' + logItem['requestParameters']['bucketName']
    send_event_to_dynamo(logItem['eventName'], logItem['requestParameters']['key'],logItem)
    push_to_sns(message)

def has_non_standard_port(logItem):
    for rule in logItem['requestParameters']['ipPermissions']['items']:
        if( rule['fromPort'] != 80 or rule['toPort'] != 80):
            return True
        elif ( rule['ipProtocol' != '6']):
            return True
    return False

def check_bucket_acl(logItem):
    grants = logItem['requestParameters']['AccessControlPolicy']['AccessControlList']['Grant']

    for grant in grants:
        if ( grant['Grantee']['xsi:type'] =='Group') and grant['Grantee']['URI'].find('global') != -1 :
            return True

    return False

lambda_handler(1,1)