'use strict';

app.controller('StartCtrl', function ($scope, $location, firebaseAuth, date) {

	$scope.genderChoices = [
		{
			'name': 'man or a woman',
			'value': 'both'
		},
		{
			'name': 'man',
			'value': 'man'
		},
		{
			'name': 'woman',
			'value': 'woman'
		}
	];

	$scope.userPreferences = {
		location: '', // this should default to location provided by facebook
		gender: $scope.genderChoices[0]
	};

	$scope.planDate = function() {
		date.setUserPreferences($scope.userPreferences);
		$location.path('/results');
	};

	// Return to homepage on logout
	$scope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		$location.path('/');
	});

});