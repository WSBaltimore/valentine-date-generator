'use strict';

app.controller('StartCtrl', function ($scope, $location, firebaseAuth, date) {
	$scope.firebaseAuth = firebaseAuth;
	$scope.genderChoices = [
		{
			'text': 'man or a woman',
			'value': 'both'
		}, {
			'text': 'man',
			'value': 'male'
		}, {
			'text': 'woman',
			'value': 'female'
		}
	];

	$scope.selectedGender = {
		text: $scope.genderChoices[0].text,
		value: $scope.genderChoices[0].value
	};

	$scope.userPreferences = {
		location: '',
		gender: ''
	};

	$scope.updateUserPrefs = function() {
		$scope.userPreferences.gender = $scope.selectedGender.value;
	};

	$scope.planDate = function() {
		$scope.loading = true;
		date.setUserPreferences($scope.userPreferences);
		$location.path('/results');
	};

	// Get user data and set location
	firebaseAuth.$getCurrentUser().then(function(data) {
		$scope.user = data;
		$scope.userPreferences.location = data.location.name;
		$scope.userPreferences.gender = $scope.genderChoices[0].value;
	});

	// Return to homepage on logout
	$scope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});

});