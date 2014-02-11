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

	FB.init({
		appId: '392018434276495',
		status: true,
		xfbml: true
	});

});