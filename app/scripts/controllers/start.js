'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $location, $http, firebaseAuth, userData) {

	$scope.firebaseAuth = firebaseAuth;
	$scope.user = firebaseAuth.auth.user;

	console.log(userData.auth.user);
	console.log(userData);

	// firebaseAuth.auth.$getCurrentUser().then(function(user) {
	// 	$scope.user = user;
	// 	return user;
	// }).then(function(user) {

	// 	// Get Facebook data
	// 	$http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,birthday,education,gender,interested_in,hometown,location,significant_other,security_settings,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,hometown,interested_in,significant_other,security_settings,email,location),mutualfriends,picture,email').then(function(facebook) {
	// 		$scope.friends = facebook.data.friends.data;
	// 	}).then(function() {
	// 		// Select Friend
	// 		// Select Gift
	// 		// Select Restaurant
	// 		// Select Activity
	// 	});

	// });

	// Once logged in, redirect to start page
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});
});