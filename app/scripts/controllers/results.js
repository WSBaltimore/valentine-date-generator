'use strict';

app.controller('ResultsCtrl', function ($scope, $location, firebaseAuth, date) {

	date.getGift().then(function(gift) {
		console.log(gift);
	});

	// Return to homepage on logout
	$scope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});