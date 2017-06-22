appConfig = {
  region: 'us-west-2',
  IdentityPoolId: '',
  UserPoolId: 'us-west-2_ZVOyiRPlS',
  ClientId: '6ifc20ul5i0rv2is1bq63k8l6b',
}

AWSCognito.config.region = appConfig.region;
var poolData = {
    UserPoolId : appConfig.UserPoolId, // your user pool id here
    ClientId : appConfig.ClientId // your app client id here
};
var userPool = 
new AmazonCognitoIdentity.CognitoUserPool(poolData);

var authenticationData = {
        Username : 'SecurityAdmin', // your username here
        Password : 'P@ssw1rd', // your password here
    };

var userData = {
        Username : 'SecurityAdmin',
        Pool : userPool
    };
    var authenticationDetails = 
new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
 
    var cognitoUser = 
new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
        },
 
        onFailure: function(err) {
            alert(err);
        },
        mfaRequired: function(codeDeliveryDetails) {
            var verificationCode = prompt('Please input verification code' ,'');
            cognitoUser.sendMFACode(verificationCode, this);
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new 
            // password and required attributes, if any, to complete 
            // authentication.

            // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user. 
            // Required attributes according to schema, which don’t have any values yet, will have blank values.
            // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.

            
            // Get these details and call 
            // newPassword: password that user has given
            // attributesData: object with key as attribute name and value that the user has given.
            cognitoUser.completeNewPasswordChallenge('P@ssw1rd', null, this);
        }
    });