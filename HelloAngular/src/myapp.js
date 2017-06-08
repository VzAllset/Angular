var app = angular.module("Hello App", []);

app.controller("Main", function ($scope, $rootScope) {
    console.log("Inside main controller..");
    $scope.greetings = "Welcome to Chennai !";
    $scope.onChange = function () {
       $scope.length = $rootScope.name.length;
    };
});

app.controller("dataController", function ($scope, $interval) {
   $scope.items = [ "Rock", "Paper", "Scissors", "Spock"]; 
    $scope.addItem = function () {
      $scope.items.push( $scope.currentItem);  
    };
    $scope.removeItem = function () {
        console.log($scope.item); 
      $scope.items.remove($scope.item); 
    };
    $scope.onSelect = function (sortField) {
        if( sortField == $scope.sortField)
            $scope.sortField = "-" + sortField;
        else
            $scope.sortField = sortField;
        
    };
    $scope.names = ["Rajesh","Raveendran","Madhav","Durgesh","Manoj","Barath","Sankaree"]
    $scope.people = [
        {serial: 1, name: "Ram Kumar", age: 33, salary: 10000},
        {serial: 2, name: "Paventhan", age: 28, salary: 20000},
        {serial: 3, name: "Saranya", age: 29, salary: 33333},
        {serial: 4, name: "Shreya", age: 22, salary: 44444}
    ];
    
    $interval(function(){
        if( $scope.people.length < 10) {
            var newPerson = {};
            newPerson.serial = Math.round(Math.random() * 100) + 1;
            newPerson.name = $scope.names[Math.round(Math.random() * 6)];
            newPerson.age = Math.round(Math.random() * 38) + 20;
            newPerson.salary = Math.round(Math.random() * 100000);
            $scope.people.push(newPerson);
        }
    },5000);
});

app.controller("parentController", function($scope) {
   $scope.name = "Ram";
    $scope.show = false;
    $scope.btnText = "Hide";
    $scope.onClick = function () {
        if( $scope.btnText == "Hide" ) {
            $scope.show = true;
            $scope.btnText = "Show";
        }
        else  {
            $scope.show = false;
            $scope.btnText = "Hide";
        }
    };
    $scope.onChange = function () {
      $scope.greeting = "Hello " + $scope.name;  
    };
});

app.controller("childController", function($scope) {

});
