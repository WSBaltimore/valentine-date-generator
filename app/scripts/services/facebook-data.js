'use strict';

app.factory('facebookData', function ($http, firebaseAuth) {
	var fbdata;

	firebaseAuth.auth.$getCurrentUser().then(function(user) {
		//fbdata =
		console.log(user);
	});

	return fbdata;
});