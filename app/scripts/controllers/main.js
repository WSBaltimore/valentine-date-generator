'use strict';

app.controller('MainCtrl', function ($scope, $firebaseAuth) {
	var firebase = new Firebase('https://valentine-date-generator.firebaseio.com');

	// AngularFire approach
	$scope.auth = $firebaseAuth(firebase);

	$scope.$on("$firebaseAuth:login", function(e, user) {
		$scope.auth.user = user;
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