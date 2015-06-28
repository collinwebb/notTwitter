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
  $scope.updateBio = function(){
    console.log($scope.activeUser.uid)
    $scope.users[$scope.activeUser.uid]["bio"] = $scope.bio;
    $scope.users.$save();
  };
  $scope.follow = function (user){
    console.log(user);
  };
  $scope.resetTweet = function(){
    $scope.newTweet = "";
  };
  $scope.resetTweet();
  $scope.makeNewTweet = function() {
    $scope.tweets.$add({
      user: $scope.activeUser,
      text: $scope.newTweet,
      time: Firebase.ServerValue.TIMESTAMP,
      favorites: 0,
      favoritedBy: $scope.activeUser.password.email + ",",
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
    var tweet = $scope.tweets[index];
    var user = $scope.activeUser.password.email;
    if (tweet.favoritedBy.split(",").indexOf(user) < 0){
      tweet.favorites++;
      tweet.favoritedBy += user + ",";
      $scope.tweets.$save(index).then(function(ref){
        ref.key() === $scope.tweets[index].$id;
      });
    }
  };
  $scope.authenticate = function (user){
    User.login(user)
   .then(function(resp){
     console.log('logged in');
     $scope.login = {};
   });
  };
  $scope.createUser = function(user){
    User.register(user)
    .then(function(resp){
      console.log('registered');
      $scope.authenticate(user);
      $scope.users[resp.uid] = {name: user.name};
      $scope.users.$save();
    });
  };
  $scope.logout = function(){
    User.logout();
  };
});
