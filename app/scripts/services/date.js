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
	 * Get an object containing the user's available Facebook data
	 * @return {object} Returns a promise
	 */
	var getFacebookData = function() {
		return firebaseAuth.getUser().then(function(user) {
			return $http.get('https://graph.facebook.com/' + user.id + '?access_token=' + user.accessToken + '&fields=id,name,age_range,relationship_status,gender,location,significant_other,checkins,family,friends.fields(name,age_range,birthday,relationship_status,gender)').then(function(facebook) {
				console.log('retrieved facebook data');
				return facebook.data;
			});
		});
	};

	/**
	 * Get an object containing the user's friends data from Facebook
	 * @return {object} A promise containing the user's friend data
	 */
	var getFriendsData = function (facebookData) {
		var facebookData = facebookData || getFacebookData();

		return facebookData.then(function(facebook) {
			console.log('retrieved friend data');
			return facebook.friends.data;
		});
	};

	/**
	 * Determines an appropriate partner for a date based on user's preferences
	 * @return {object} A promise containing the user's selected partner's data
	 */
	var getPartner = function (friends) {
		var available_friends = [];
		var valid = true;

		angular.forEach(friends, function(friend, key) {
			valid = true;

			// filter by age
			if( friend.hasOwnProperty('birthday') && friend.birthday.length == 10 && getAge( friend.birthday ) < 50 ) {
				valid = false;
			}

			// filter by gender
			if( friend.hasOwnProperty('gender') ) {
				if( userPreferences.gender.value != 'both' && userPreferences.gender.value != friend.gender ) {
					valid = false;
				}
			} else if( userPreferences.gender.value != 'both' ) {
				valid = false;
			}

			// filter by relationship status
			if( friend.hasOwnProperty('relationship_status') && friend.relationship_status != 'Single' ) {
				valid = false;
			}

			if( valid ) this.push( friend );
		}, available_friends);

		// Just pick a random friend for now...
		var friendId = available_friends[ getRandomInt(0, available_friends.length - 1) ].id;

		return firebaseAuth.getUser().then(function(user) {
			return $http.get('https://graph.facebook.com/' + friendId + '?access_token=' + user.accessToken + '&fields=name,gender,age_range,favorite_athletes,favorite_teams,albums,television,music,movies,games,books').then(function(partner) {
				console.log('retrieved partner data');
				return partner;
			});
		});
	};

	/**
	 * Determines an appropriate gift for the user's selected partner
	 * @param {object} partner An object containing data about the user's selected partner
	 */
	var getGift = function (partner) {
		var gift;
		var giftText;

		// incoming super janky coding practices because I don't know how to do anything properly with looping and arrays in JS
		var books_count = ( partner.hasOwnProperty('books') ) ? partner.books.data.length : 0;
		var games_count = ( partner.hasOwnProperty('games') ) ? partner.games.data.length : 0;
		var movies_count = ( partner.hasOwnProperty('movies') ) ? partner.movies.data.length : 0;
		var music_count = ( partner.hasOwnProperty('music') ) ? partner.music.data.length : 0;
		var television_count = ( partner.hasOwnProperty('television') ) ? partner.television.data.length : 0;
		var count_totals = [ books_count, games_count, movies_count, music_count, television_count ];
		var count_max = Math.max.apply( Math, count_totals );
		var count_max_index = count_totals.indexOf( count_max );

		if( count_max == 0 ) {
			// user has no media interests - fall back to gender defaults
			switch( partner.gender ) {
				case 'female':
					giftText = 'flowers';
					break;
				case 'male':
					giftText = 'chocolate';
					break;
				default:
					giftText = 'i dunno man good luck';
			}
		} else {
			// user has media interests - pick a gift from their favorite medium
			switch( count_max_index ) {
				case 0:
					gift = partner.books.data[ getRandomInt( 0, books_count - 1 ) ];
					giftText = 'a hardback copy of' + gift.name;
					break;
				case 1:
					gift = partner.games.data[ getRandomInt( 0, games_count - 1 ) ];
					giftText = 'a copy of ' + gift.name;
					break;
				case 2:
					gift = partner.movies.data[ getRandomInt( 0, movies_count - 1 ) ];
					giftText = gift.name + ' on DVD';
					break;
				case 3:
					gift = partner.music.data[ getRandomInt( 0, music_count - 1 ) ];
					giftText = 'tickets to a ' + gift.name + ' concert';
					break;
				case 4:
					gift = partner.television.data[ getRandomInt( 0, television_count - 1 ) ];
					giftText = 'a ' + gift.name + ' box set';
					break;
			}
		}

		return giftText;
	};

	/**
	 * Determines an appropriate restaurant to take the user's selected partner
	 * @param {object} partner  An object containing data about the user's selected partner
	 */
	var getRestaurant = function (partner) {
		// Use the user's location to find restaurants nearby
		// userPreferences.location is the string to use with Google API
		return 'Gin Mill';
	};

	/**
	 * Determines an appropriate activity to do with the user's selected partner
	 * @param {object} partner  An object containing data about the user's selected partner
	 */
	var getActivity = function (partner) {

		return 'Jumping Jacks';
	};

	/**
	 * Run all necessary processes to generate a date outcome
	 * @return {object} An object containing the details of the date
	 */
	var generateDate = function () {
		return getFriendsData().then(function(friends) {
			return getPartner(friends).then(function (partner) {
				date.partner = partner.data;
				date.gift = getGift(partner.data);
				date.restaurant = getRestaurant(partner.data);
				date.activity = getActivity(partner.data);

				return date;
			});
		});
	};

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * Calculates a user's age given a properly formatted date of birth
	 */
	function getAge(birthday) {
	    var today = new Date();
	    var birthDate = new Date(birthday);
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
	        age--;
	    }    
	    return age;
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