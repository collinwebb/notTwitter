app.controller("LoginCtrl", function($scope, $firebaseObject, $rootScope, $location){
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
  $scope.authenticate = function (){
    $rootScope.fbRef.authWithPassword({
      email: $scope.email,
      password : $scope.password
    }, function(error, authData) {
      $rootScope.currentUser = authData
      $location.path("/");
    });
  };
});
