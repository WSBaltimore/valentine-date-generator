'use strict';

app.factory('gift', function ($http, firebaseAuth) {

	var userData = firebaseAuth.user;
	var gift = {};

	gift.getFriendLikes = function () {

	};

	gift.doSomethingWithFriendLikes = function () {

	};

	return gift;

});