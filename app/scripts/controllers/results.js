'use strict';

app.controller('ResultsCtrl', function ($scope, $location, date, theDate) {
	$scope.date = date;
	$scope.theDate = theDate;
	$scope.prefs = date.userPreferences;

	$scope.share = {
		short_title: "Weber Shandwick Valentine Date Generator",
		long_title: 'Weber Shandwick planned the perfect Valentines date for me with ' + theDate.partner.name + '! First I\'ll be taking ' + theDate.partner.first_name  + ' to ' + theDate.activity.name + '. Afterwards we\'ll be going to ' + theDate.restaurant.name + ' for some delicious food. I\'m going to surprise ' + theDate.pronoun + ' with ' + theDate.gift + '!',
		description: "Need date ideas for Valentine's day? Let Weber Shandwick choose the perfect date for you.",
		link: "http://myvalentinedate.com",
		caption: "myvalentinedate.com",
		image: "http://myvalentinedate.com/images/share.png",
		hashtags: "myvalentinedate"
	};
});