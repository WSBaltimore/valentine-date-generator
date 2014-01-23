'use strict';

var app = angular.module('valentineDateGeneratorApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'firebase']);

app.config( function( $routeProvider, $provide ) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/start', {
			templateUrl: 'views/start.html',
			controller: 'StartCtrl',
			resolve: {
				userData: function (firebaseAuth, $http) {
					var facebookData = {};

					var promise = firebaseAuth.getUser().then(function(user) {
						facebookData.user = user;
						return user;
					}).then(function(user) {
						// Get Facebook data
						return $http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,birthday,education,gender,interested_in,hometown,location,significant_other,security_settings,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,hometown,interested_in,significant_other,security_settings,email,location),mutualfriends,picture,email').then(function(facebook) {
							facebookData.facebook = facebook.data;
							return facebookData;
						});
					}).then(function(facebookData) {
						return facebookData;
					});

					return promise;
				}
			}
		})
		.when('/results', {
			templateUrl: 'views/results.html',
			controller: 'ResultsCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	$provide.decorator('$rootScope', [
		'$delegate',
		function($delegate) {
			$delegate.safeApply = function(fn) {
				var phase = $delegate.$$phase;
				if (phase === "$apply" || phase === "$digest") {
					if (fn && typeof fn === 'function') {
						fn();
					}
				} else {
					$delegate.$apply(fn);
				}
			};
			return $delegate;
		}
	]);

});