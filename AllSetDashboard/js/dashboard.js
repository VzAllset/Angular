var app = angular.module("ServiceDemo", ["ngResource"]);


app.service("eventsProvider", function ($resource) {
    var that = this;
    that.authToken = '';
    this.events = [];
    
    var prod = $resource("https://velzsi3f3d.execute-api.us-west-2.amazonaws.com/prod/microserviceAPI");
    
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
                that.authToken = result.getAccessToken().getJwtToken();
                //prod.save({"ProductID": 110, "ProductName": "Detol", "ProductType": "DisInfectant", "Price": //20});
                prod.get().$promise.then(function(events) {
                    this.events = events.Items; 
                });
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
    
    
});

app.factory("personFactory", function(taxRate) {
   return {
       people : [],
       addPerson : function(newPerson) {
            this.people.push(newPerson);
        }
   } ; 
});
        
app.controller("NewPersonController", function ($scope, personFactory) {
    
    $scope.addPerson = function () {
        var newPerson = {};
        newPerson.serial = $scope.serial;
        newPerson.name = $scope.name;
        newPerson.age = $scope.age;
        newPerson.salary = $scope.salary;
        personFactory.addPerson(newPerson);
    };
});
       
app.controller("NewProductController", function ($scope, $resource, $rootScope) {
    
    $scope.addProduct = function () {
        var newProduct = {};
        newProduct.ProductID = $scope.id;
        newProduct.ProductName = $scope.name;
        newProduct.ProductType = $scope.type;
        newProduct.Price = $scope.price;
       
        var prod = $resource("https://sheetsu.com/apis/v1.0/d63ce3b699c2");
        prod.save(newProduct).$promise.then(function(){
           alert("Product Added Successfullly.");
            $rootScope.$broadcast("Added",newProduct);
        });
    };
});
    
app.controller("PeopleListController", function ($scope, personFactory) {
    $scope.people = personFactory.people; 
    $scope.sortField = 'serial';
    $scope.onSelect = function (sortField) {
        if( sortField == $scope.sortField)
            $scope.sortField = "-" + sortField;
        else
            $scope.sortField = sortField;
        
    };
    
});

app.filter("applyTax", function() {
   return function (salary) {
       if( salary > 50000) {
           return salary - salary * 0.30;
       }
       else if( salary > 30000) {
           return salary - salary * 0.20;
       }
       else if( salary > 15000) {
           return salary - salary * 0.10;
       }
       else 
           return salary;
   } 
});

app.filter("filterByName", function() {
   return function(all,pattern) {
       var regExp = new RegExp(pattern);
       var result = [];
       for( var i in all) {
           if( regExp.test(all[i].name)) {
               result.push(all[i]);
           }
          
       }
        return result;
   } 
});

app.controller("serviceController", function ($scope, eventsProvider) {
    
    $scope.$authToken = '';
    $scope.showModal = true;
    $scope.sortField = 'event_name';
    $scope.onSelect = function (sortField) {
        if( sortField == $scope.sortField)
            $scope.sortField = "-" + sortField;
        else
            $scope.sortField = sortField;
        
    };
    
    $scope.open = function() {
        $scope.showModal = true;
    };

    $scope.ok = function() {
        $scope.showModal = false;
    };

    $scope.cancel = function() {
      $scope.showModal = false;
    };
    
    $scope.events = eventsProvider.events;
    
    
     
    
    /*$http.get("https://sheetsu.com/apis/v1.0/d63ce3b699c2").then(
    function(response) {
       $scope.products = response.data; 
    });*/
    
});
