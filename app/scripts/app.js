'use strict';

var app = angular.module('valentineDateGeneratorApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'firebase']);

app.config( function( $routeProvider, $provide ) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
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