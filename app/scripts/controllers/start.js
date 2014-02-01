'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $http, $location, firebaseAuth, userData, activity, restaurant, gift) {
	$scope.firebaseAuth = firebaseAuth;

	console.log(userData);

	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});