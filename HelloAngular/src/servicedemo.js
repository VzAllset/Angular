var app = angular.module("ServiceDemo", ["ngResource"]);

app.constant("taxRate", "0.30")

app.service("personProvider", function (taxRate) {
    this.people = [];
    this.addPerson = function (newPerson) {
        this.people.push(newPerson);
    };
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

app.controller("serviceController", function ($scope, $http, $resource) {
    
    $scope.sortField = 'ProductID';
    $scope.onSelect = function (sortField) {
        if( sortField == $scope.sortField)
            $scope.sortField = "-" + sortField;
        else
            $scope.sortField = sortField;
        
    };
    
    var prod = $resource("https://sheetsu.com/apis/v1.0/d63ce3b699c2");
    
    
    //prod.save({"ProductID": 110, "ProductName": "Detol", "ProductType": "DisInfectant", "Price": //20});
     prod.query().$promise.then(function(products) {
       $scope.products = products; 
    });
    
    
    $scope.$on("Added", function(event,obj){
       $scope.products.push(obj); 
    });
     
    
    /*$http.get("https://sheetsu.com/apis/v1.0/d63ce3b699c2").then(
    function(response) {
       $scope.products = response.data; 
    });*/
    
});

app.directive("myTemplate", function() {
   return {
       restrict: 'E',
       transclude: true,
       templateUrl:'template.html'
   } 
});