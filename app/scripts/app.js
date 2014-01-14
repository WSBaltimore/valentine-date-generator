'use strict';

var app = angular.module('valentineDateGeneratorApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'firebase']);

app.config( function( $routeProvider ) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});