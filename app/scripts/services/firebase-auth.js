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

	auth.getFacebookData = function() {
		return auth.getUser().then(function(user) {
			return $http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,gender,location,significant_other,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,significant_other,television.fields(name,id),movies.fields(name,id),games.fields(name,id),music.fields(id,name),books.fields(name,id))').then(function(facebook) {
				return facebook.data;
			});
		});
	};

	return auth;
});