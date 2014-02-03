'use strict';

app.factory('gift', function ($http, firebaseAuth) {

	var userData = firebaseAuth.user;
	console.log(userData);
	var gift = {};
	var gift_text = '';

	/**
	 * Get Facebook Data
	 * @param  {object} facebook Data returned from request to get Facebook data
	 */
	firebaseAuth.getFacebookData().then(function (facebook) {
		var friends = facebook.friends.data;

		// you have the facebook data object now
		// do whatever you need to with the data
		// like pick a friend or something
		var date = friends[ getRandomInt(0, friends.length - 1) ];
		
		console.log( date );

		// incoming super janky coding practices because I don't know how to do anything properly with looping and arrays in JS
		var books_count = ( date.hasOwnProperty('books') ) ? date.books.data.length : 0;
		var games_count = ( date.hasOwnProperty('games') ) ? date.games.data.length : 0;
		var movies_count = ( date.hasOwnProperty('movies') ) ? date.movies.data.length : 0;
		var music_count = ( date.hasOwnProperty('music') ) ? date.music.data.length : 0;
		var television_count = ( date.hasOwnProperty('television') ) ? date.television.data.length : 0;
		var count_totals = [ books_count, games_count, movies_count, music_count, television_count ];
		var count_max = Math.max.apply( Math, count_totals );
		var count_max_index = count_totals.indexOf( count_max );

		console.log( count_totals );
		console.log( count_max );

		if( count_max == 0 ) {
			// user has no media interests - fall back to gender defaults
			switch( date.gender ) {
				case 'female':
					gift_text = 'flowers';
					break;
				case 'male':
					gift_text = 'chocolate';
					break;
				default:
					gift_text = 'i dunno man good luck';
			}
		} else {
			// user has media interests - pick a gift from their favorite medium
			switch( count_max_index ) {
				case 0:
					gift = date.books.data[ getRandomInt( 0, books_count - 1 ) ];
					gift_text = 'a hardback copy of' + gift.name;
					break;
				case 1:
					gift = date.games.data[ getRandomInt( 0, games_count - 1 ) ];
					gift_text = 'a copy of ' + gift.name;
					break;
				case 2:
					gift = date.movies.data[ getRandomInt( 0, movies_count - 1 ) ];
					gift_text = gift.name + ' on DVD';
					break;
				case 3:
					gift = date.music.data[ getRandomInt( 0, music_count - 1 ) ];
					gift_text = 'tickets to a ' + gift.name + ' concert';
					break;
				case 4:
					gift = date.television.data[ getRandomInt( 0, television_count - 1 ) ];
					gift_text = 'a ' + gift.name + ' box set';
					break;
			}
		}

		console.log( gift );
		console.log( gift_text );
	});

	/**
	 * Returns a random integer between min and max
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {};
});