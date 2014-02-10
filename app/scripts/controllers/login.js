'use strict';

app.controller('LoginCtrl', function ($scope, $rootScope, $location, date) {

	$scope.login = function() {
		date.getUserData().then(function(user) {
			$location.path('/start');
		});
	};

});