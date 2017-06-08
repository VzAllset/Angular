var app = angular.module("todayapp",[]);

app.service("personProvider",function(){
  this.person = [];

  this.addPerson = function(x){
   this.person.push(x);   
  }
});

app.controller("formController",function($scope,personProvider){
    $scope.addPerson = function(){
        x = {};
        x.sno = $scope.sno;
        x.name = $scope.name;
        x.age = $scope.age;
        x.salary = $scope.salary;
        personProvider.addPerson(x);
        
        
    }
});

app.controller("tableController",function($scope,personProvider){
    $scope.persons = personProvider.person;
});