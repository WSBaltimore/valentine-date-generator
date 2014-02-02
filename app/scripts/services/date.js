'use strict';

app.factory('date', function ($http, firebaseAuth) {

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

	/**
	 * Get an object containing the user's available Facebook data
	 * @return {object} Returns a promise
	 */
	var getFacebookData = function() {
		return firebaseAuth.getUser().then(function(user) {
			return $http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,gender,location,significant_other,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender,significant_other,television.fields(name,id),movies.fields(name,id),games.fields(name,id),music.fields(id,name),books.fields(name,id))').then(function(facebook) {
				return facebook.data;
			});
		});
	};

	/**
	 * Get an object containing the user's friends data from Facebook
	 * @return {object}          A promise containing the user's friend data
	 */
	var getFriendsData = function () {
		return getFacebookData().then(function(facebook) {
			return facebook.friends.data;
		});
	};

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
	 * Determines an appropriate partner for a date based on user's preferences
	 * @return {object} A promise containing the user's selected partner's data
	 */
	var getPartner = function () {
		// using the user's location and gender preferences
		// select a facebook friend to be their partner

		return getFriendsData().then(function(friends) {
			// For now we'll just pick a random person...
			return friends[ getRandomInt(0, friends.length - 1) ];
		});
	};

	/**
	 * Determines an appropriate gift for the user's selected partner
	 * @param {object} partner An object containing data about the user's selected partner
	 */
	var getGift = function (partner) {
		// using the user's selected partner data
		// select a gift based on the partner's interests

		return getPartner().then(function(partner) {
			// user partner data to choose gift
			var gift;
			return gift;
		});
	};

	/**
	 * Determines an appropriate restaurant to take the user's selected partner
	 * @param {object} partner  An object containing data about the user's selected partner
	 */
	var getRestaurant = function (partner) {
		// using the user's selected partner data and location preference
		// select a restaurant based on the partner's checkins

		return restaurant = '';
	};

	/**
	 * Determines an appropriate activity to do with the user's selected partner
	 * @param {object} partner  An object containing data about the user's selected partner
	 */
	var getActivity = function (partner) {
		// using the user's selected partner data and location preference
		// select an activity based on the partner's interests

		return activity = '';
	};

	/**
	 * Run all necessary processes to generate a date outcome
	 * @return {object} An object containing the details of the date
	 */
	var generateDate = function () {
		date.partner = getPartner();
		date.gift = setGift();
		date.restaurant = setRestaurant();
		date.activity = setActivity();

		return date;
	};

	/**
	 * Get Facebook Data
	 * @param  {object} facebook Data returned from request to get Facebook data
	 */
	// firebaseAuth.getFacebookData().then(function (facebook) {
	// 	var friends = facebook.friends.data;

	// 	// you have the facebook data object now
	// 	// do whatever you need to with the data
	// 	// like pick a friend or something
	// 	var date = friends[ getRandomInt(0, friends.length - 1) ];

	// 	console.log( date );

	// 	// incoming super janky coding practices because I don't know how to do anything properly with looping and arrays in JS
	// 	var books_count = ( date.hasOwnProperty('books') ) ? date.books.data.length : 0;
	// 	var games_count = ( date.hasOwnProperty('games') ) ? date.games.data.length : 0;
	// 	var movies_count = ( date.hasOwnProperty('movies') ) ? date.movies.data.length : 0;
	// 	var music_count = ( date.hasOwnProperty('music') ) ? date.music.data.length : 0;
	// 	var television_count = ( date.hasOwnProperty('television') ) ? date.television.data.length : 0;
	// 	var count_totals = [ books_count, games_count, movies_count, music_count, television_count ];
	// 	var count_max = Math.max.apply( Math, count_totals );
	// 	var count_max_index = count_totals.indexOf( count_max );

	// 	console.log( count_totals );
	// 	console.log( count_max );

	// 	if( count_max == 0 ) {
	// 		// user has no media interests - fall back to gender defaults
	// 		switch( date.gender ) {
	// 			case 'female':
	// 				gift_text = 'flowers';
	// 				break;
	// 			case 'male':
	// 				gift_text = 'chocolate';
	// 				break;
	// 			default:
	// 				gift_text = 'i dunno man good luck';
	// 		}
	// 	} else {
	// 		// user has media interests - pick a gift from their favorite medium
	// 		switch( count_max_index ) {
	// 			case 0:
	// 				gift = date.books.data[ getRandomInt( 0, books_count - 1 ) ];
	// 				gift_text = 'a hardback copy of' + gift.name;
	// 				break;
	// 			case 1:
	// 				gift = date.games.data[ getRandomInt( 0, games_count - 1 ) ];
	// 				gift_text = 'a copy of ' + gift.name;
	// 				break;
	// 			case 2:
	// 				gift = date.movies.data[ getRandomInt( 0, movies_count - 1 ) ];
	// 				gift_text = gift.name + ' on DVD';
	// 				break;
	// 			case 3:
	// 				gift = date.music.data[ getRandomInt( 0, music_count - 1 ) ];
	// 				gift_text = 'tickets to a ' + gift.name + ' concert';
	// 				break;
	// 			case 4:
	// 				gift = date.television.data[ getRandomInt( 0, television_count - 1 ) ];
	// 				gift_text = 'a ' + gift.name + ' box set';
	// 				break;
	// 		}
	// 	}

	// 	console.log( gift );
	// 	console.log( gift_text );
	// });

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {
		getFacebookData: getFacebookData,
		getFriendsData: getFriendsData,
		setUserPreferences: setUserPreferences,
		getPartner: getPartner,
		getGift: getGift,
		getRestaurant: getRestaurant,
		getActivity: getActivity,
		generateDate: generateDate,
		userPreferences: userPreferences,
		date: date
	};
});