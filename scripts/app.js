var app = angular.module("uiDemo", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "partials/home.html"
    })
    .when("/weather", {
        templateUrl : "partials/weather.html"
    });
});



app.controller('weatherArea',function($scope){

$scope.weatherJson= {
  "lat": 33.44,
  "lon": -94.04,
  "timezone": "America/Chicago",
  "timezone_offset": -21600,
  "current": {
    "dt": 1595243443,
    "sunrise": 1608124431,
    "sunset": 1608160224,
    "temp": 274.75,
    "feels_like": 270.4,
    "pressure": 1017,
    "humidity": 96,
    "dew_point": 274.18,
    "uvi": 0,
    "clouds": 90,
    "visibility": 6437,
    "wind_speed": 3.6,
    "wind_deg": 320,
    "weather": [
      {
        "id": 701,
        "main": "Mist",
        "description": "mist",
        "icon": "50n"
      }
    ]
  }
};
});
