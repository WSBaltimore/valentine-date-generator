'use strict';

app.factory('activity', function ($http, firebaseAuth) {

	var userData = firebaseAuth.user;
	var activity = {};

	activity.getFriendLikes = function () {

	};

	activity.doSomethingWithFriendLikes = function () {

	};

	return activity;

});