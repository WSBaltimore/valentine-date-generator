'use strict';

app.controller('ResultsCtrl', function ($scope, $location, firebaseAuth, date, theDate) {
	$scope.firebaseAuth = firebaseAuth;
	$scope.prefs = date.userPreferences;
	$scope.date = theDate;

	$scope.share = {
		title: "Weber Shandwick Valentine's Day Date Generator",
		description: "Need date ideas for Valentine's day? Let Weber Shandwick choose the perfect date for you.",
		link: "http://myvalentinedate.com",
		caption: "myvalentinedate.com",
		image: "/images/share.png",
		hashtags: "myvalentinedate"
	};

	// Return to homepage if user preferences aren't set
	console.log($scope.prefs);

	// Return to homepage on logout
	$scope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});