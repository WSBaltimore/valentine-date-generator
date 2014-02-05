'use strict';

app.factory('firebaseAuth', function ($http, $firebaseSimpleLogin) {
	var firebaseRef = new Firebase('https://valentine-date-generator.firebaseio.com');
	var auth = $firebaseSimpleLogin(firebaseRef);

	auth.facebookLogin = function() {
		auth.$login('facebook', {
			rememberMe: true,
			scope: 'email,user_likes,user_birthday,user_checkins,user_hometown,user_interests,user_location,user_photos,user_relationships,user_relationship_details,friends_likes,friends_birthday,friends_checkins,friends_hometown,friends_interests,friends_location,friends_photos,friends_relationships,friends_relationship_details'
		});
	};

	auth.logout = function () {
		auth.$logout();
	};

	auth.getUser = function () {
		return auth.$getCurrentUser().then(function(user) {
			return user;
		});
	};

	return auth;
});