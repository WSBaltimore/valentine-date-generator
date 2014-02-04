'use strict';

app.controller('StartCtrl', function ($scope, $location, firebaseAuth, date) {

	$scope.firebaseAuth = firebaseAuth;

	$scope.genderChoices = [
		{
			'text': 'man',
			'value': 'male'
		},
		{
			'text': 'woman',
			'value': 'female'
		},
		{
			'text': 'man or a woman',
			'value': 'both'
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