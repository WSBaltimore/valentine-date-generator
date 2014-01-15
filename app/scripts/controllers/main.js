'use strict';

app.controller('MainCtrl', function ($scope, $http, $firebaseAuth) {
	var firebase = new Firebase('https://valentine-date-generator.firebaseio.com');

	// AngularFire approach
	$scope.auth = $firebaseAuth(firebase);

	$scope.$on("$firebaseAuth:login", function(e, user) {
		$scope.auth.user = user;
		console.log($scope.auth.user);

		// Get friend info
		$http({
			method: 'GET',
			url: 'https://graph.facebook.com/'+ $scope.auth.user.thirdPartyUserData.id +'?access_token='+ $scope.auth.user.accessToken +'&fields=id,name,gender,age_range,location,relationship_status,significant_other,friends.fields(name,age_range,gender,location,relationship_status,significant_other)'
		}).success(function(data, status, headers, config) {
			console.log(data);
			$scope.fbData = data;;
		}).error(function(data, status, headers, config) {
			console.log(data);
		});
	});

	// Firebase approach
	// var auth = new FirebaseSimpleLogin(firebase, function(error, user) {
	// 	if (error) {
	// 		console.log(error);
	// 	} else if (user) {
	// 		// user authenticated with Firebase
	// 		console.log(user);
	// 	} else {
	// 		// user is logged out
	// 		console.log('logged out');
	// 	}
	// });

	// console.log(auth);

	// $scope.login = function() {
	// 	auth.login('facebook', {
	// 		rememberMe: true,
 //  			scope: 'email,user_likes,user_birthday,user_checkins,user_hometown,user_interests,user_location,user_photos,user_relationships,user_relationship_details,friends_likes,friends_birthday,friends_checkins,friends_hometown,friends_interests,friends_location,friends_photos,friends_relationships,friends_relationship_details'
	// 	});
	// };

	// $scope.logout = function() {
	// 	auth.logout();
	// };

});