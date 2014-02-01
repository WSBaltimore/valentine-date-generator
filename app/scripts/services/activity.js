'use strict';

app.factory('activity', function ($http, firebaseAuth) {

	var userData = firebaseAuth.user;
	var activity = {};

	activity.getFriendLikes = function () {

	};

	activity.doSomethingWithFriendLikes = function () {

	};

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return activity;

});