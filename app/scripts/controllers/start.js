'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $http, $location, firebaseAuth, userData, activity, restaurant, gift) {
	$scope.firebaseAuth = firebaseAuth;
	$scope.user = userData;
	$scope.friends = userData.facebook.friends.data;

	console.log($scope.user);
	console.log($scope.friends);


	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});