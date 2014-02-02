'use strict';

app.controller('LoginCtrl', function ($scope, $location, firebaseAuth) {
	$scope.auth = firebaseAuth;

	// Once logged in, redirect to start page
	$scope.$on("$firebaseSimpleLogin:login", function(e, user) {
		$location.path('/start');
		console.log('login');
	});
});