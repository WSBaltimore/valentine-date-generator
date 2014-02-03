'use strict';

app.factory('date', function ($http, $q, firebaseAuth) {

	var userPreferences = {
		location: '',
		gender: ''
	};

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
	 * Get an object containing the user's login data
	 * @return {object} A promise containing the user's simple login data
	 */
	var getUserData = function () {
		return firebaseAuth.getUser().then(function(user) {
			console.log('retrieved user data');
			return user;
		});
	};

	/**
	 * Get an object containing the user's available Facebook data
	 * @return {object} A promise containing the user's Facebook data
	 */
	var getFacebookData = function(user) {
		return $http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,gender,location,significant_other,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,significant_other,television.fields(name,id),movies.fields(name,id),games.fields(name,id),music.fields(id,name),books.fields(name,id))').then(function(facebook) {
			console.log('retrieved facebook data');
			return facebook.data;
		});
	};

	/**
	 * Determines an appropriate partner for a date based on user's preferences
	 * @return {object} A promise containing the user's selected partner's data
	 */
	var getPartnerData = function (facebook) {
		var friends = facebook.friends.data;

		// Just pick a random friend for now...
		var friendId = getRandomArrayValue(friends).id;

		return firebaseAuth.getUser().then(function(user) {
			return $http.get('https://graph.facebook.com/' + friendId + '?access_token=' + user.accessToken + '&fields=name,first_name,gender,age_range,favorite_athletes,favorite_teams,albums,television,music,movies,games,books').then(function(partner) {
				console.log('retrieved partner data');
				return partner;
			});
		});
	};

	var getLocationData = function (types, keyword) {
		// user userPreferences.location to get geoencoded coordinates to be used on future location based queries
		return $http.get('https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + userPreferences.location).then(function (location) {
			var coords = location.data.results[0].geometry.location;
			var service = new google.maps.places.PlacesService(document.getElementById('map'));
			var request = {
				location: new google.maps.LatLng(coords.lat,coords.lng),
				radius: '8000'
			};

			if (types.length) request.types = types;
			if (keyword) request.keyword = keyword;

			var deferred = $q.defer();

			service.nearbySearch(request, function (results, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					console.log(results);
					deferred.resolve(results);
				}
			});

			return deferred.promise;
		});
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
		var interestName = getRandomArrayValue(interestData).name; console.log(interestName); // string of the selected 'like' eg. 'top gun'

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
	 * Run all necessary processes to generate a date outcome
	 * @return {object} An object containing the details of the date
	 */
	var generateDate = function () {
		var activityDefaults = ['bowling', 'skating', 'walk', 'dancing', 'museum', 'bar', 'movie theater', 'laser tag'];

		var restaurant = getLocationData(['restaurant', 'food']).then(function (restaurants) {
			return getRandomArrayValue(restaurants).name;
		});

		var activity = getLocationData([], getRandomArrayValue(activityDefaults)).then(function (activities) {
			return getRandomArrayValue(activities).name;
		});

		var user = getUserData().then(function (user) {
			return user;
		});

		var facebook = user.then(function (user) {
			return getFacebookData(user);
		});

		var partner = facebook.then(function (facebook) {
			return getPartnerData(facebook);
		});

		return $q.all([restaurant, activity, partner]).then(function(locations) {
			console.log(locations);
			return partner.then(function(partner) {
				date.partner = partner.data;
				date.gift = getGift(partner.data);
				date.restaurant = locations[0];
				date.activity = locations[1];
				date.pronoun = partner.data.gender === 'male' ? 'him' : 'her';

				return date;
			});
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