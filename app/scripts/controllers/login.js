'use strict';

app.controller('LoginCtrl', function ($rootScope, $scope, $location, firebaseAuth) {
	$scope.firebaseAuth = firebaseAuth;

	// Once logged in, redirect to start page
	$rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
		$location.path('/start');
	});
});