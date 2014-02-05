'use strict';

var app = angular.module('valentineDateGeneratorApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngDropdowns', 'firebase']);

app.config( function( $routeProvider, $provide ) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/start', {
			templateUrl: 'views/start.html',
			controller: 'StartCtrl'
		})
		.when('/results', {
			templateUrl: 'views/results.html',
			controller: 'ResultsCtrl',
			resolve: {
				theDate: function (date) {
					return date.generateDate();
				}
			}
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