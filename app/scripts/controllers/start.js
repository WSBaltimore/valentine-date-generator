'use strict';

app.controller('StartCtrl', function ($scope, $location, firebaseAuth, date) {

	$scope.firebaseAuth = firebaseAuth;

	$scope.genderChoices = [
		{
			'name': 'man or a woman',
			'value': 'both'
		},
		{
			'name': 'man',
			'value': 'male'
		},
		{
			'name': 'woman',
			'value': 'female'
		}
	];

	$scope.userPreferences = {
		location: '',
		gender: $scope.genderChoices[0]
	};

	// Set location
	firebaseAuth.$getCurrentUser().then(function(data) {
		$scope.userPreferences.location = data.location.name;
	});

	$scope.planDate = function() {
		date.setUserPreferences($scope.userPreferences);
		$location.path('/results');
	};

	// Return to homepage on logout
	$scope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});

});