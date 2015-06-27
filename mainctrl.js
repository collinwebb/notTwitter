app.controller("MainCtrl", function($scope, $firebaseArray){
  var ref = new Firebase("https://nottwitter.firebaseio.com");
  $scope.tweets = $firebaseArray(ref.child("tweets"));
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.makeNewTweet = function() {
    $scope.tweets.$add({
      text: $scope.newTweet
    });
  };
});
