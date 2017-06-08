var app = angular.module("catalogManager", ["ngRoute"]);

app.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                when('/view', {
                    templateUrl : 'catalogView.html',
                    controller : 'ViewController'
                }).
                when('/home', {
                    template : "<div class='alert-warning'><h3> Welcome to Catalog Management System</h3></div>",
                    controller : 'HomeController'
                }).
                when('/admin', {
                    templateUrl : 'catalogEdit.html',
                    controller: 'EditController'
                }).
                otherwise({
                    redirectTo: '/home'
                })
            }
           ]);

app.controller('HomeController', function($scope, catalogService,  $route){ 
    $scope.$on('$routeChangeSuccess', function() {
        $('.active').removeClass('active');
        $('#HomeMenu').addClass('active');
    });
});

app.controller('ViewController', function($scope, catalogService,  $route){
   $scope.things = ["Specs", "Wallet", "keys", "Pen"];
    $scope.birds = ["Eagle", "Crow", "Parrot", "Penguin"];
    $scope.cities = catalogService.cities;
    $scope.$on('$routeChangeSuccess', function() {
        $('.active').removeClass('active');
        $('#ViewMenu').addClass('active');
   });
    
});

app.controller('EditController', function($scope, catalogService, $route){
    $scope.cities = catalogService.cities;
   $scope.$on('$routeChangeSuccess', function() {
        $('.active').removeClass('active');
        $('#EditMenu').addClass('active');
   });

    $scope.addCity = function() {
        catalogService.cities.push($scope.newCity);
    };
    $scope.deleteCity = function(item) {
               var index = catalogService.cities.indexOf(item);
                catalogService.cities.splice(index, 1);
           }
});

app.service("catalogService", function () {
    this.cities = ["Chennai", "Madurai", "Trichy", "Coimbatore", "Salem", "Tirunelveli"]; 
    
});
