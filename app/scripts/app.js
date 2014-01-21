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
					return firebaseAuth.getUser().then(function(user) {
						firebaseAuth.user = user;
						return user;
					}).then(function(user) {
						// Get Facebook data
						$http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,birthday,education,gender,interested_in,hometown,location,significant_other,security_settings,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,hometown,interested_in,significant_other,security_settings,email,location),mutualfriends,picture,email').then(function(facebook) {
							firebaseAuth.fbdata = facebook;
						});
						return firebaseAuth;
					});
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