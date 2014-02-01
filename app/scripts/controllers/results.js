'use strict';

app.controller('ResultsCtrl', function ($rootScope, $scope, $location, firebaseAuth) {

	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});