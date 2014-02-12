'use strict';

app.factory('date', function ($http, $q, $location) {

	var userID;
	var accessToken;

	var userPreferences = {};
	var date = {
		partner: {},
		restaurant: {},
		activity: {},
		gift: ''
	};

	if (userID === 'undefined' || accessToken === 'undefined') {
		$location.path('/');
		return;
	}

	////////////////////
	// Data Requests //
	////////////////////

	var logout = function() {
		FB.logout();
		$location.path('/');
	};

	var getLoginStatus = function () {
		var deferred = $q.defer();

		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				userID = response.authResponse.userID;
				accessToken = response.authResponse.accessToken;
				deferred.resolve(response);
			} else {
				deferred.reject();
			}
		});

		return deferred.promise;
	};

	var getUserData = function () {
		var deferred = $q.defer();

		FB.login(function(response) {
			if (response.authResponse) {
				userID = response.authResponse.userID;
				accessToken = response.authResponse.accessToken;
				deferred.resolve( response );
			} else {
				deferred.reject();
				console.log('User cancelled login or did not fully authorize.');
			}
		}, { scope: 'user_birthday,user_location,user_relationships,user_relationship_details,friends_birthday,friends_location,friends_relationships,friends_relationship_details'});

		return deferred.promise;
	};

	/**
	 * Get an object containing the user's available Facebook data
	 * @return {object} A promise containing the user's Facebook data
	 */
	var getFacebookData = function() {
		return $http.get('https://graph.facebook.com/' + userID + '?access_token=' + accessToken + '&fields=id,name,gender,location,family,friends.fields(name,birthday,relationship_status,gender)').success(function(facebook) {
			console.log('retrieved facebook data');
			return facebook;
		}).error(function (data) {
			console.log(data);
			$location.path('/');
		});
	};

	/**
	 * Determines an appropriate partner for a date based on user's preferences
	 * @return {object} A promise containing the user's selected partner's data
	 */
	var getPartnerData = function (facebook) {
		var friends = facebook.data.friends.data;
		var availableFriends = [];
		var family = [];
		var valid = true;

		// setup array of family member IDs
		if (facebook.data.family) {
			angular.forEach(facebook.data.family.data, function(familyMember, key) {
				this.push(familyMember.id);
			}, family);
		}

		angular.forEach(friends, function(friend, key) {
			valid = true;

			// filter by age
			if( friend.hasOwnProperty('birthday') && friend.birthday.length == 10 && getAge( friend.birthday ) < 18 ) {
				valid = false;
			}

			// filter by gender
			if( friend.hasOwnProperty('gender') ) {
				if( userPreferences.gender !== 'both' && userPreferences.gender !== friend.gender ) {
					valid = false;
				}
			} else if ( userPreferences.gender !== 'both' ) {
				valid = false;
			}

			// filter by relationship status
			if( friend.hasOwnProperty('relationship_status') && friend.relationship_status != 'Single' ) {
				valid = false;
			}

			// filter by family relation
			if( family.indexOf( friend.id ) != -1 ) {
				valid = false;
			}

			if( valid ) this.push( friend );
		}, availableFriends);

		// Just pick a random friend for now...
		var friendId = getRandomArrayValue(availableFriends).id;

		return $http.get('https://graph.facebook.com/' + friendId + '?access_token=' + accessToken + '&fields=name,first_name,gender,favorite_athletes,favorite_teams,albums,television,music,movies,games,books').then(function(partner) {
			console.log('retrieved partner data');
			return partner;
		});
	};

	var getCoordinateData = function () {
		return $http.get('https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + userPreferences.location).success(function (coords) {
			console.log('retrieved coordinates');
			return coords;
		}).error(function (data) {
			console.log('error getting coordinates!');
		});
	};

	var getLocationData = function (location, options) {
		if (location.data.status !== 'OK') { return; }

		var options = (typeof options === 'object') ? options : {};
		var coords = location.data.results[0].geometry.location;

		var request = {};
		request.location = new google.maps.LatLng(coords.lat, coords.lng);
		request.radius = '8000';
		if (options.hasOwnProperty('types')) request.types = options.types;
		if (options.hasOwnProperty('keyword')) request.keyword = options.keyword;

		var deferred = $q.defer();
		var service = new google.maps.places.PlacesService(document.getElementById('map'));
		service.nearbySearch(request, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				console.log('retrieved location data');
				deferred.resolve(results);
			} else {
				console.log('no location data!');
				deferred.reject(status);
			}
		});

		return deferred.promise;
	};

	/////////////////////
	// Normal Methods //
	/////////////////////

	/**
	 * Sets the user's location and gender preferences
	 * @param {object} prefs Accepts an object containing user's preferences
	 */
	var setUserPreferences = function (prefs) {
		if (!prefs || typeof prefs !== 'object') { return false; };

		angular.forEach(prefs, function(value, key) {
			if( prefs.hasOwnProperty(key) ) {
				this[key] = value;
			}
		}, userPreferences);
	};

	/**
	 * Determines an appropriate gift for the user's selected partner
	 * @param {object} partner An object containing data about the user's selected partner
	 */
	var getGift = function (partner) {
		console.log('selecting gift');

		var giftDefaults = ['flowers', 'chocolates', 'balloons', 'a framed picture', 'a stuffed animal', 'a new car', 'jewelry', 'a watch', 'a wink and a smile'];
		var interests = ['music', 'movies', 'television', 'books', 'games'];
		var friendInterests = [];

		angular.forEach(partner, function(value, key) {
			// get only user non-inherited properties and only if they match our interests array
			if (partner.hasOwnProperty(key) && interests.indexOf(key) !== -1) {
				this.push(key);
			}
		}, friendInterests);

		// user has no media interests, fall back to defaults
		if ( !friendInterests.length ) {
			return getRandomArrayValue(giftDefaults);
		}

		var randomInterest = getRandomArrayValue(friendInterests); // string of interest type eg. 'movies'
		var interestData = partner[randomInterest].data; // array of objects containing individual likes eg. [0]object.name = 'lord of the rings'
		var interestName = getRandomArrayValue(interestData).name; // string of the selected 'like' eg. 'top gun'

		// user has media interests - pick a gift from their favorite medium
		switch( randomInterest ) {
			case 'books':
				return 'a hardback copy of "' + interestName + '"';
				break;
			case 'games':
				return 'a copy of "' + interestName + '"';
				break;
			case 'movies':
				return '"' + interestName + '" on DVD';
				break;
			case 'music':
				return 'tickets to a "' + interestName + '" concert';
				break;
			case 'television':
				return 'a "' + interestName + '" box set';
				break;
			default:
				return getRandomArrayValue(giftDefaults);
		}
	};

	/**
	 * Calculates a user's age given a properly formatted date of birth
	 * @param {string} User's birthday
	 */
	var getAge = function (birthday) {
	    var today = new Date();
	    var birthDate = new Date(birthday);
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	        age--;
	    }
	    return age;
	};

	/**
	 * Run all necessary processes to generate a date outcome
	 * @return {object} An object containing the details of the date
	 */
	var generateDate = function () {
		console.log('generating date...');

		// If we don't have all the data we need, send them on their way...
		if (userID === 'undefined' || accessToken === 'undefined') {
			$location.path('/');
			return;
		} else if (typeof userPreferences.location === 'undefined' || typeof userPreferences.gender === 'undefined') {
			$location.path('/start');
			return;
		}

		// Set Activity
		var activity = {};
		var activities = ['a cozy bar', 'a romantic spot', 'a cool museum', 'a trendy cafe', 'a karaoke bar', 'a cave for some spelunking', 'a pole dancing class', 'ye olde fashioned photo parlor', 'stargaze on the hood of your car', 'a bikram yoga class', 'a prancercising class', 'a zoo', 'a spiritual medium', 'your family reunion', 'a gun range', 'a hunting lodge', 'an art gallery', 'an arcade', 'a wine tasting', 'a brewery', 'a medical operating theater', 'a driving range', 'a spa', 'a LAN meetup', 'a mini golf course', 'play darts', 'the opera', 'a movie', 'volunteer with the community', 'skydive', 'a bouncy castle', 'a mime show' ];
		activity.name = getRandomArrayValue(activities);
		activity.link = encodeURI('https://www.google.com/#q=' + activity.name.replace(' ', '+') + '+in+' + userPreferences.location.replace(' ', '+') );

		// Restaurant
		var restaurantDefaults = ['a steak house', 'an Italian restaurant', 'a Chinese restaurant', 'a sushi bar', 'a teppanyaki restaurant', 'a fondue restaurant', 'a burger joint', 'a fast food restaurant'];
		var restaurant = getCoordinateData().then(function (coords) {
			var restaurant = {};
			var randomRestaurant = {};
			var options = { 'types': ['restaurant', 'cafe', 'bar'] };

			if (coords.data.status !== 'OK') { return; }

			return getLocationData(coords, options).then(function(restaurants) {
				var selectedRestaurant = getRandomArrayValue(restaurants);
				restaurant.name = selectedRestaurant.name;
				restaurant.link = encodeURI('https://www.google.com/maps/preview/place/' + selectedRestaurant.name.replace(' ', '+') + '/@' + selectedRestaurant.geometry.location.d + ',' + selectedRestaurant.geometry.location.e + ',17z');
				return restaurant;
			}, function(data) {
				// no results found, return a default restaurant
				randomRestaurant = getRandomArrayValue(restaurantDefaults);
				restaurant.name = randomRestaurant;
				restaurant.link = encodeURI('https://www.google.com/#q=' + randomRestaurant.replace(' ', '+') + '+in+' + userPreferences.location.replace(' ', '+'));
				return restaurant;
			});

		});

		// Facebook
		var partner = getFacebookData().then(function (facebook) {
			return getPartnerData(facebook);
		});

		return $q.all([restaurant, partner]).then(function(data) {
			var restaurant = data[0];
			var	partner = data[1].data;

			// If no coordinate data, pick a random restaurant
			if (!restaurant) {
				console.log('no coordinate data, picking random restaurant');
				var randomRestaurant = getRandomArrayValue(restaurantDefaults);
				date.restaurant.name = randomRestaurant;
				date.restaurant.link = encodeURI('https://www.google.com/#q=' + randomRestaurant.replace(' ', '+') + '+in+' + userPreferences.location.replace(' ', '+') );
			} else {
				date.restaurant = restaurant;
			}

			date.activity = activity;
			date.partner = partner;
			date.gift = getGift(partner);
			date.pronoun = partner.gender === 'male' ? 'him' : 'her';

			return date;
		});
	};

	///////////////////////
	// Helper Functions //
	///////////////////////

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Returns the value of a randomly selected key in an array
	 * @param  {array} arr Array from which to select a value
	 */
	function getRandomArrayValue(arr) {
		return arr[ getRandomInt(0, arr.length - 1) ];
	}

	return {
		user: { userId: userID, accessToken: accessToken},
		getLoginStatus: getLoginStatus,
		getUserData: getUserData,
		getFacebookData: getFacebookData,
		setUserPreferences: setUserPreferences,
		getPartnerData: getPartnerData,
		getGift: getGift,
		generateDate: generateDate,
		userPreferences: userPreferences,
		date: date,
		logout: logout
	}
});