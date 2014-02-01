'use strict';

app.factory('restaurant', function ($http, firebaseAuth) {

	var userData = firebaseAuth.user;
	var restaurant = {};

	restaurant.getFriendLikes = function () {

	};

	restaurant.doSomethingWithFriendLikes = function () {

	};

	return restaurant;

});