'use strict';

app.factory('firebaseAuth', function ($http, $q) {
	var firebase = new Firebase('https://valentine-date-generator.firebaseio.com');
	var deferredData = $q.defer();

	new FirebaseSimpleLogin(firebase, function(error, user) {
		if (error) {
			deferredData.reject(error);
		} else if (user) {
			deferredData.resolve(user);
		}
	});

	return {
		user: function () {
			return deferredData.promise;
		},

		login: function() {
			simpleLogin.login('facebook', {
				rememberMe: true,
				scope: 'email,user_likes,user_birthday,user_checkins,user_hometown,user_interests,user_location,user_photos,user_relationships,user_relationship_details,friends_likes,friends_birthday,friends_checkins,friends_hometown,friends_interests,friends_location,friends_photos,friends_relationships,friends_relationship_details'
			});
		},

		logout: function() {
			simpleLogin.logout();
		},

		getFacebookData: function(userId, accessToken) {
			return $http.get('https://graph.facebook.com/' + userId + '?access_token=' + accessToken + '&fields=id,name,age_range,relationship_status,birthday,education,gender,interested_in,hometown,location,significant_other,security_settings,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,hometown,interested_in,significant_other,security_settings,email,location),mutualfriends,picture,email');
		}
	}

});

app.controller('MainCtrl', function ($scope, firebaseAuth) {

	var auth = firebaseAuth;

	auth.user().then(function (data) {
		$scope.user = data;
		console.log($scope.user);
	},
	function (error) {
		console.log(error);
	});

});