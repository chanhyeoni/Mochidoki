var appAngular = angular.module("mochidokiApp", ['ngRoute']);

// route configuration
appAngular.config(function($routeProvider) {
    $routeProvider
       .when("/", {
            templateUrl: "/partial/main.html",
            controller: "mainController"
        })             
        .when("/login", {
            templateUrl: "/partial/main.html",
            controller: "loginController",
        })
});

// controller
appAngular.controller("mainController", function($scope, $http){
    // first check whether the user has been authenticated
    var message = "";
    $http({
        method: 'GET',
        url: '/isLoggedIn'
    }).then(function(response){
        console.log("response received from mainController");
        console.log(response.data);
        var isLoggedIn = response.data.isLoggedIn;
        if(isLoggedIn == true){
            $http({
                method: 'GET',
                url: '/invoices'
            }).then(function(response){
                console.log(response.data);
                message = "There are " + response.data.length + " invoices."
                $scope.invoices = response.data; 
                
                $scope.message = message;
                console.log("finished getting isLoggedIn");
            }, function(response){
                message = "error getting invoices : " + response;
                console.log(message);
                
                $scope.invoices = [];
                $scope.message = message;
            })      
        }
        $scope.isLoggedIn = isLoggedIn;
    },function(response){
        message = "Signin failed: " + response; 
        $scope.isLoggedIn = false;
        $scope.message = message;
    });
    console.log("finished in mainController");
});

appAngular.controller("loginController", function($scope, $http, $route){
    // first check whether the user has been authenticated
    $scope.isLoggedIn = false;

    $scope.submit = function(){
        var status = 0;
        var invoices = [];
        var data = {"email": $scope.email, "password": $scope.password};
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http({
            method: 'POST',
            url: '/login', 
            data : data, 
            headers: config
        }).then(function(response){
            console.log("response received from loginController");        
            $scope.status = response.data.status;
            $scope.message = response.data.message;
            $scope.invoices = response.data.invoices;
            $route.reload();
        }, function(response){
            $scope.status = 500;
            $scope.message = "Error in loginController. ";
        });     
    }
});