'use strict';

app.factory('firebaseAuth', function ($rootScope) {
	var auth = {};
	var firebase = new Firebase('https://valentine-date-generator.firebaseio.com');
	var client = new FirebaseSimpleLogin(firebase, function(error, user) {
		if (error) {
			console.log(error);
		} else if (user) {
			auth.user = user;
			auth.broadcastAuthEvent();
		} else {
			auth.user = null;
			auth.broadcastAuthEvent();
		}
	});

	var broadcastAuthEvent = function() {
		$rootScope.$broadcast('authEvent');
	};

	var login = function() {
		client.login('facebook', {
			rememberMe: true,
			scope: 'email,user_likes,user_birthday,user_checkins,user_hometown,user_interests,user_location,user_photos,user_relationships,user_relationship_details,friends_likes,friends_birthday,friends_checkins,friends_hometown,friends_interests,friends_location,friends_photos,friends_relationships,friends_relationship_details'
		});
	};

	var logout = function() {
		client.logout();
	};

	return auth = {
		broadcastAuthEvent: broadcastAuthEvent,
		login: login,
		logout: logout
	}
});

app.controller('MainCtrl', function ($scope, firebaseAuth) {

	$scope.login = function() {
		firebaseAuth.login();
	};

	$scope.logout = function() {
		firebaseAuth.logout();
	};

	$scope.isLoggedIn = function() {
		return !!$scope.user;
	};

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
		$scope.safeApply(function() {
			$scope.user = firebaseAuth.user;
		});
	});

});