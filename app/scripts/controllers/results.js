'use strict';

app.controller('ResultsCtrl', function ($scope, $location, date, theDate) {
	$scope.date = date;
	$scope.prefs = date.userPreferences;
	$scope.theDate = theDate;

	$scope.share = {
		title: "Weber Shandwick Valentine's Day Date Generator",
		description: "Need date ideas for Valentine's day? Let Weber Shandwick choose the perfect date for you.",
		link: "http://myvalentinedate.com",
		caption: "myvalentinedate.com",
		image: "/images/share.png",
		hashtags: "myvalentinedate"
	};
});