'use strict';

app.factory('date', function ($http, $q, firebaseAuth) {

	var userPreferences = {};
	var date = {
		partner: {},
		restaurant: '',
		activity: '',
		gift: ''
	};

	////////////////////
	// Data Requests //
	////////////////////

	/**
	 * Get an object containing the user's available Facebook data
	 * @return {object} A promise containing the user's Facebook data
	 */
	var getFacebookData = function(user) {
		return $http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,gender,location,significant_other,checkins,family,friends.fields(name,birthday,relationship_status,gender,significant_other,television.fields(name,id),movies.fields(name,id),games.fields(name,id),music.fields(id,name),books.fields(name,id))').then(function(facebook) {
			console.log('retrieved facebook data');
			console.log(facebook.data);
			return facebook.data;
		});
	};

	/**
	 * Determines an appropriate partner for a date based on user's preferences
	 * @return {object} A promise containing the user's selected partner's data
	 */
	var getPartnerData = function (facebook) {
		var family = [];
		var friends = facebook.friends.data;
		var availableFriends = [];
		var valid = true;

		// setup array of family member IDs
		angular.forEach(facebook.family.data, function(familyMember, key) {
			this.push( familyMember.id );
		}, family);

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

		return firebaseAuth.$getCurrentUser().then(function(user) {
			return $http.get('https://graph.facebook.com/' + friendId + '?access_token=' + user.accessToken + '&fields=name,first_name,gender,favorite_athletes,favorite_teams,albums,television,music,movies,games,books').then(function(partner) {
				console.log('retrieved partner data');
				console.log(partner);
				return partner;
			});
		});
	};

	var getCoordinateData = function () {
		return $http.get('https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + userPreferences.location).success(function (coords) {
			console.log('retrieved coordinates');
			return coords;
		}).error(function(data) {
			console.log('error getting coordinates! ' + data);
		});
	};

	var getLocationData = function (location, options) {
		var options = (typeof options === 'object') ? options : {};
		var deferred = $q.defer();
		var coords = location.data.results[0].geometry.location;
		var service = new google.maps.places.PlacesService(document.getElementById('map'));
		var request = {};

		request.location = new google.maps.LatLng(coords.lat, coords.lng);
		request.radius = '8000';
		if (options.types) request.types = options.types;
		if (options.keyword) request.keyword = options.keyword;

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

		var restaurantDefaults = ['a steak restaurant', 'an Italian restaurant', 'a Chinese restaurant'];
		var activityDefaults = ['a fun bar', 'a skating rink', 'a romantic spot', 'a cool museum', 'a trendy cafe'];
		var activityKeywords = ['bowling', 'skating', 'walk', 'dancing', 'museum', 'bar', 'movie theater'];
		var activityTypes = ['amusement_park', 'aquarium', 'art_gallery', 'bar', 'book_store', 'bowling_alley', 'cafe', 'casino', 'movie_theater', 'museum', 'night_club', 'park', 'spa', 'zoo'];

		// Location
		var coords = getCoordinateData().then(function(coords) {
			return coords;
		}, function (error) {
			console.log(error);
		});

		var activity = coords.then(function(coords) {
			if (coords.data.status !== 'OK') {
				return getRandomArrayValue(activityDefaults);
			}

			var options = { 'types': activityTypes, 'keyword': getRandomArrayValue(activityKeywords) };

			return getLocationData(coords, options).then(function (activities) {
				return getRandomArrayValue(activities).name;
			}, function (data) {
				return getRandomArrayValue(activityDefaults);
			});
		});

		var restaurant = coords.then(function (coords) {
			if (coords.data.status !== 'OK') {
				return getRandomArrayValue(restaurantDefaults);
			}

			var options = { 'types': ['restaurant', 'cafe', 'bar'] };

			return getLocationData(coords, options).then(function (restaurants) {
				console.log(getRandomArrayValue(restaurants).name);
				return getRandomArrayValue(restaurants).name;
			}, function (data) {
				// no results found, return a default restaurant
				return getRandomArrayValue(restaurantDefaults);
			});
		});

		// Facebook
		var user = firebaseAuth.$getCurrentUser().then(function (user) {
			return user;
		});

		var facebook = user.then(function (user) {
			return getFacebookData(user);
		});

		var partner = facebook.then(function (facebook) {
			return getPartnerData(facebook);
		});

		return $q.all([restaurant, activity, partner]).then(function(data) {
			console.log(data);

			var restaurant = data[0];
			var	activity = data[1];
			var	partner = data[2].data;

			date.restaurant = restaurant;
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
		getFacebookData: getFacebookData,
		setUserPreferences: setUserPreferences,
		getPartnerData: getPartnerData,
		getGift: getGift,
		generateDate: generateDate,
		userPreferences: userPreferences,
		date: date
	}
});