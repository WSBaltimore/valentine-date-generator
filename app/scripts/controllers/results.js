'use strict';

app.controller('ResultsCtrl', function ($scope, $location, firebaseAuth, date, theDate) {
	$scope.prefs = date.userPreferences;
	$scope.date = theDate;

	// Return to homepage if user preferences aren't set
	console.log($scope.prefs);

	// Return to homepage on logout
	$scope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});