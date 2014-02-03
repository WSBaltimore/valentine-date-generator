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
			return $http.get('https://graph.facebook.com/' + friendId + '?access_token=' + user.accessToken + '&fields=name,first_name,gender,age_range,favorite_athletes,favorite_teams,albums,television,music,movies,games,books').then(function(partner) {
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
			return giftDefaults[ getRandomInt(0, giftDefaults.length - 1) ];
		}

		var randomInterest = friendInterests[ getRandomInt(0, friendInterests.length - 1) ]; // string of interest type eg. 'movies'
		var interestData = partner[randomInterest].data; // array of objects containing individual likes eg. [0]object.name = 'lord of the rings'
		var interestName = interestData[ getRandomInt(0, interestData.length - 1) ].name; console.log(interestName); // string of the selected 'like' eg. 'top gun'

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
				return giftDefaults[ getRandomInt(0, giftDefaults.length - 1) ];
		}

	};

	/**
	 * Determines an appropriate restaurant to take the user's selected partner
	 */
	var getRestaurant = function () {
		// find a restaurant nearby the user's location preference

		return 'Gin Mill';
	};

	/**
	 * Determines an appropriate activity to do with the user's selected partner
	 * @param {object} partner  An object containing data about the user's selected partner
	 */
	var getActivity = function (partner) {
		// Try taking your date...
		var activityDefaults = ['bowling', 'skating', 'for a drive', 'on a romantic walk', 'dancing', 'to a museum', 'bar hopping', 'to a movie', 'to play laser tag'];

		return activityDefaults[ getRandomInt(0, activityDefaults.length - 1) ];
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