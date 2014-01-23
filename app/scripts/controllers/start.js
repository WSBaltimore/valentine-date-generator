'use strict';

app.controller('StartCtrl', function ($rootScope, $scope, $location, firebaseAuth, userData) {
	$scope.firebaseAuth = firebaseAuth;
	$scope.user = userData.user;
	$scope.friends = userData.facebook.friends.data;
	console.log($scope.user);
	console.log($scope.friends);

	/**
	 * Select Partner
	 * @return {object} Object containing information about selected partner
	 */
	var getPartner = function () {
		var rand = getRandomInt(0, $scope.friends.length);
		return $scope.friends[rand];

		// Todo: limit to m/f only
		// Todo: limit to non family members
		// Todo: limit to area nearby user
		// Todo: allow user to select their own
	};

	console.log(getPartner());

	/**
	 * Select Gift
	 * @return {string} Name of the gift to buy your partner
	 */
	var getGift = function () {
		var giftName;
		return giftName;
	};

	console.log(getGift());

	/**
	 * Select Restaurant
	 * @return {string} Name of the restaurant you should take your partner to
	 */
	var getRestaurant = function () {
		var restaurantName;
		return restaurantName;
	};

	console.log(getRestaurant());

	/**
	 * Select Activity
	 * @return {string} Name of the activity to do with your partner
	 */
	var getActivity = function () {
		var activityName;
		return activityName;
	};

	console.log(getActivity());

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Return to homepage on logout
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
		console.log('logout');
	});
});