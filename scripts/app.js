var app = angular.module("uiDemo", ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/home.html"
        })
        .when("/weather", {
            templateUrl: "partials/weather.html"
        });
});

app.controller('formSubmit',function($scope){


});

app.controller('weatherArea', function($scope, $http, $sce, getData) {
    $scope.loading = true;
    $scope.lat = 40.347099;
    $scope.lon = -74.064957;
    $scope.weatherJson = {};
    $scope.loadingMessage = "Please allow your browser to access your location";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log("position",position);
            $scope.$evalAsync(function() {
                $scope.lat = position.coords.latitude;
                $scope.lan = position.coords.longitude;
                $scope.loadingMessage = "Predicting The Weather";
                getData.setLocation($scope.lat, $scope.lon);
                getData.weather().then(function mySuccess(response) {
                    $scope.weatherJson = response;
                    $scope.loading = false;
                });

            })
        });
    } else {
      console.log("Navigation is stopped");
        getData.setLocation($scope.lat, $scope.lon);
        $scope.loadingMessage = "Predicting The Weather for Red Bank, NJ";
        getData.weather().then(function mySuccess(response) {
            $scope.weatherJson = response;
            $scope.loading = false;
        });

    }

    $scope.getDirection = function(angle) {
      //Since the direction is based on a circle we can figure out what direction it faces
        var directions = ['North', 'North-West', 'West', 'South-West', 'South', 'South-East', 'East', 'North-East'];
        return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
    }
    $scope.getWeatherIcon = function(weather) {
      //We have more icons. However, for now lets do basic ones. Cloud, Rain, Snow, Sunny. Anything else will default to sunny
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

    $scope.getsunIcon = function(sunTime){
      //The icons we use go from 1-12. Therefore if the time is military time subtract 12 to get the number we need
      var sunHour = new Date(sunTime * 1000).getHours();
      if(sunHour > 12){
        sunHour -=12;
      }
      return 'wi-time-'+sunHour;

    }

});




app.service('getData', function($http,$timeout) {
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
