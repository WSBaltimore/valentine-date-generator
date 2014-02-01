'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $http, $location, firebaseAuth, userData, activity, restaurant, gift) {
	$scope.firebaseAuth = firebaseAuth;
	//$scope.user = userData;
	//$scope.friends = userData.facebook.friends.data;

	console.log(userData);

	// console.log($scope.user);
	// console.log($scope.friends);


	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});