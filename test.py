import boto3
def lambda_handler(event, context):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('verizon--cloudtrail-logs')
    S3KeyPrefix='AWSLogs/476522037579/CloudTrail/us-east-2/2017/06/15/'
    for obj in bucket.objects.all():
        #print obj.key
	if obj.key.find(S3KeyPrefix) != -1:
            #print obj.key
            content = obj.get()['Body'].read()
            return content


print lambda_handler(1,1);

