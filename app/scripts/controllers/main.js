'use strict';

app.factory('firebaseAuth', function ($rootScope, $http) {
	var auth = {};
	var firebase = new Firebase('https://valentine-date-generator.firebaseio.com');

	auth.client = new FirebaseSimpleLogin(firebase, function(error, user) {
		if (error) {
			console.log(error);
		} else if (user) {
			auth.user = user;
			$rootScope.$broadcast('authEvent');
		}
	});

	auth.login = function() {
		auth.client.login('facebook', {
			rememberMe: true,
			scope: 'email,user_likes,user_birthday,user_checkins,user_hometown,user_interests,user_location,user_photos,user_relationships,user_relationship_details,friends_likes,friends_birthday,friends_checkins,friends_hometown,friends_interests,friends_location,friends_photos,friends_relationships,friends_relationship_details'
		});
	};

	auth.logout = function() {
		auth.client.logout();
	};

	auth.getFacebookData = function (userId, accessToken) {
		return $http.get('https://graph.facebook.com/' + userId + '?access_token=' + accessToken + '&fields=id,name,age_range,relationship_status,birthday,education,gender,interested_in,hometown,location,significant_other,security_settings,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,hometown,interested_in,significant_other,security_settings,email,location),mutualfriends,picture,email');
	};

	return auth;
});

app.controller('MainCtrl', function ($scope, firebaseAuth) {
	var auth = firebaseAuth;

	$scope.login = auth.login;
	$scope.logout = auth.logout;

	// Once the "user" object is returned from logging in...
	$scope.$on('authEvent', function() {
		$scope.safeApply(function() {
			$scope.user = auth.user;

			// Get data from Facebook
			auth.getFacebookData($scope.user.id, $scope.user.accessToken).then(function (data) {
				var fbData = data.data;
				$scope.friends = fbData.friends.data;
				console.log($scope.friends);
			});

		});
	});
});