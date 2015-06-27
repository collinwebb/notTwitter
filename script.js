'use strict';

var app = angular.module("notTwitter", ["firebase", "ngRoute"])
.config(function($routeProvider){
  $routeProvider
    .when("/", {
      controller: "MainCtrl",
      templateUrl: "tweets.html"
    })
    .when("/login", {
      controller: "LoginCtrl",
      templateUrl: "login.html"
    })
    .otherwise({
      redirectTo: "/"
    })
});
// .service("tweetService", function(){});
