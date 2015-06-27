'use strict';

var app = angular.module("notTwitter", ["firebase", "ngRoute"])
.run(function($window, $rootScope, $firebaseAuth){
  $rootScope.fbRef = new $window.Firebase("https://nottwitter.firebaseio.com");
  $rootScope.afAuth = $firebaseAuth($rootScope.fbRef);
})
.factory('User', function($rootScope){
  function User(){}

  User.register = function(user){
    return $rootScope.afAuth.$createUser(user);
  };
  User.login = function(user){
    return $rootScope.afAuth.$authWithPassword(user);
  };

  User.logout = function(){
    return $rootScope.afAuth.$unauth();
  };

  return User;
});
// .config(function($routeProvider){
//   $routeProvider
//     .when("/", {
//       controller: "MainCtrl",
//       templateUrl: "index.html"
//     })
//     .otherwise({
//       redirectTo: "/"
//     })
// });
// .service("tweetService", function(){});
app.controller("MainCtrl", function(User, $rootScope, $scope, $firebaseArray, $firebaseObject){
  // var ref = new Firebase("https://nottwitter.firebaseio.com");
  $rootScope.afAuth.$onAuth(function(data){
    if(data){
      console.log(data);
      $rootScope.activeUser = data;
      $rootScope.fbUser = $rootScope.fbRef.child('users/' + data.uid);
      $rootScope.afUser = $firebaseObject($rootScope.fbUser);
    }else{
      $rootScope.activeUser = null;
      $rootScope.fbUser = null;
      $rootScope.afUser = null;
    }
  });
  $scope.tweets = $firebaseArray($rootScope.fbRef.child("tweets"));
  $scope.users = $firebaseObject($rootScope.fbRef.child("users"));
  $scope.resetTweet = function(){
    $scope.newTweet = "";
  };
  $scope.resetTweet();
  $scope.makeNewTweet = function() {
    $scope.tweets.$add({
      user: $scope.currentUser,
      text: $scope.newTweet,
      time: Firebase.ServerValue.TIMESTAMP,
      favorites: 0,
      retweets: 0
    });
    $scope.resetTweet();
  };
  $scope.charactersRemaining = function(){
    return 140 - $scope.newTweet.length;
  };
  $scope.isTweetMaxed = function(){
    return $scope.charactersRemaining() < 0;
  };
  $scope.upvote = function(index){
    $scope.tweets[index].favorites++;
    $scope.tweets.$save(index).then(function(ref){
      ref.key() === $scope.tweets[index].$id;
    });
  };
  $scope.authenticate = function (){
    $rootScope.fbRef.authWithPassword({
      email: $scope.email,
      password : $scope.password
    }, function(error, authData) {
      $scope.currentUser = authData;
    });
  };
  $scope.createUser = function(){
    $rootScope.fbRef.createUser({
      email: $scope.email,
      password: $scope.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        $scope.authenticate();
      }
    });
  };
  $scope.logout = function(){
    User.logout();
  };
});
