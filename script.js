'use strict';

var app = angular.module("notTwitter", ["firebase"]);

app.controller("MainCtrl", function($scope, $firebaseObject){
  var fbRef = new Firebase("https://nottwitter.firebaseio.com");
  var syncObject = $firebaseObject(fbRef);
  syncObject.$bindTo($scope, "data");
});
