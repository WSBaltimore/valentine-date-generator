'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $http, $location, firebaseAuth, activity, restaurant, gift) {
	$scope.firebaseAuth = firebaseAuth;

	// console.log($scope.user);
	// console.log($scope.friends);

	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});