'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $http, $location, firebaseAuth, activity, restaurant, gift) {

	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});