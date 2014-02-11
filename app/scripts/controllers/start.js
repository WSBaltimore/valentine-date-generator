'use strict';

app.controller('StartCtrl', function ($scope, $location, date) {
	$scope.date = date;

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
	date.getLoginStatus().then(function(status) {
		date.getFacebookData().then(function(facebook) {
			$scope.user = facebook.data;
			$scope.userPreferences.location = facebook.data.location.name;
			$scope.userPreferences.gender = $scope.genderChoices[0].value;
		});
	});

});