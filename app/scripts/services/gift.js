'use strict';

app.factory('gift', function ($http, firebaseAuth) {

	var userData = firebaseAuth.user;

	/**
	 * Get Facebook Data
	 * @param  {object} facebook Data returned from request to get Facebook data
	 */
	firebaseAuth.getFacebookData().then(function (facebook) {
		console.log(facebook);

		var friends = facebook.friends.data;

		// you have the facebook data object now
		// do whatever you need to with the data
		// like pick a friend or something
		var myMatch = friends[ getRandomInt(0, friends.length) ];
		console.log(myMatch);
	});

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {};

});