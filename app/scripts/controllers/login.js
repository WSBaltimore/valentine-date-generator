'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, $location, firebaseAuth) {
	$scope.auth = firebaseAuth;

	// Once logged in, redirect to start page
	$rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
		$location.path('/start');
		console.log('login');
	});
});