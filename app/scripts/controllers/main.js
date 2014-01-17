'use strict';

app.factory('firebaseAuth', function ($rootScope) {
	var auth = {};
	var firebase = new Firebase('https://valentine-date-generator.firebaseio.com');
	var broadcastAuthEvent = function() {
		$rootScope.$broadcast('authEvent');
	};

	auth.client = new FirebaseSimpleLogin(firebase, function(error, user) {
		if (error) {
			console.log(error);
		} else if (user) {
			auth.user = user;
			broadcastAuthEvent();
		} else {
			auth.user = null;
			broadcastAuthEvent();
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

	return auth;
});

app.controller('MainCtrl', function ($scope, firebaseAuth) {

	$scope.login = firebaseAuth.login;
	$scope.logout = firebaseAuth.logout;
	$scope.isLoggedIn = !!$scope.user;

	// src: Alex Vanston (https://coderwall.com/p/ngisma)
	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if (phase == '$apply' || phase == '$digest') {
			if (fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};

	$scope.$on('authEvent', function() {
		$scope.$apply(function() {
			$scope.user = firebaseAuth.user;
		});
	});

});