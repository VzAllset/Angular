var app = angular.module("DirectiveDemo", []);

app.controller("rootController", function($scope) {
    $scope.things = ["Specs", "Wallet", "keys", "Pen"];
    $scope.birds = ["Eagle", "Crow", "Parrot", "Penguin"];
    $scope.cities = ["Chennai", "Madurai", "Trichy", "Coimbatore", "Salem", "Tirunelveli"];
    $scope.addCity = function() {
        $scope.cities.push($scope.newCity);
    };
});

app.directive("myDir", function() {
   
    return {
        
        link : function ($scope, element, attr) {
            console.log(element);
            console.log(attr);
            element.append("<h3> This text is appended by Directive</h3>");
            element.css("backgroundColor","green");
            
            switch(attr.current) {
                case "things":
                    $scope.currentItems = $scope.things;
                    break;
                case "birds":
                    $scope.currentItems = $scope.birds;
                    break;
                case "cities":
                    $scope.currentItems = $scope.cities;
                    break;
           }
        }
    };
});

app.directive("scopeDefined", function() {
   return {
       scope : {
           x : '@',
           y : '='
       },
       controller : function ($scope) {
           $scope.data = "Controller Data",
            $scope.deleteItem = function(item) {
               var index = $scope.y.indexOf(item);
                $scope.y.splice(index, 1);
           }
       },
       template : "<div class='alert-success'> x: {{x}}, y: {{y}}, data: {{data}} <ul>\
                <li ng-repeat='item in y' >{{item}} &nbsp;&nbsp;<button class='btn-danger' ng-click='deleteItem(item)'> X </span></li>\
            </ul> </div>"
   } ;
});