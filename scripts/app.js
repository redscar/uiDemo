var app = angular.module("uiDemo", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/home.html"
        })
        .when("/weather", {
            templateUrl: "partials/weather.html"
        });
});



app.controller('weatherArea', function($scope, $http, $sce, getData) {

    $scope.lat = 40.347099;
    $scope.lon = -74.064957;
    $scope.weatherJson = {};

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $scope.$evalAsync(function() {
                $scope.lat = position.coords.latitude;
                $scope.lan = position.coords.longitude;
                getData.setLocation($scope.lat, $scope.lon);
                getData.weather().then(function mySuccess(response) {
                    $scope.weatherJson = response;
                });

            })
        });
    } else {
        getData.setLocation($scope.lat, $scope.lon);
        getData.weather().then(function mySuccess(response) {
            $scope.weatherJson = response;
        });

    }

    $scope.getDirection = function(angle) {
        var directions = ['North', 'North-West', 'West', 'South-West', 'South', 'South-East', 'East', 'North-East'];
        return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
    }
    $scope.getWeatherIcon = function(weather) {
        if (weather.toLowerCase().includes("cloud")) {
            return "wi-cloud";
        } else if (weather.toLowerCase().includes("rain")) {
            return "wi-rain";
        } else if (weather.toLowerCase().includes("snow")) {
            return "wi-snow";
        } else {
            return "wi-day-sunny";

        }

    }
    $scope.getWindDirectionIcon = function(windDirectionDegrees) {
      //There are two classes we can use for the icons. From and Towards. Based off the API directions the wind degrees is measured using meteorological which means its where ir originates. Therefore we use "From"
      return 'from-'+windDirectionDegrees+'-deg'
    }

});




app.service('getData', function($http) {
    //Set our default localData variable
    localData = {};
    //Default to red bank
    localData.lat = 40.347099;
    localData.lon = -74.064957;

    //Set location function, pass in latitute and longitude
    this.setLocation = function(lat, lon) {
        localData.lat = lat;
        localData.lon = lon;
        return;
    }
    this.weather = function() {
        /*
        Get weather function. Uses openweathermap.org.
        Documentation: https://openweathermap.org/api/one-call-api

        Warning: since I do not have a server to make the request to I must hard code the API key. Usually this would be hidden via server side code
        */
        return $http.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + localData.lat + '&lon=' + localData.lon + '&appid=e996dcef9df8cd0b916530923ec04af5&units=imperial')
            .then(function mySuccess(response) {
                return response.data;
            }, function myError(response) {
                console.log(response.statusText);
            });
    }

});
