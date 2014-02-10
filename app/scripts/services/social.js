'use strict';

app.factory('social', function () {

	/**
	 * Pops a Facebook 'share to wall' dialog using the element's data attributes
	 * @param  {object} el The target of the event
	 * @return {true}
	 */
	var fbShare = function(el) {
		var $el = $(el),
			name = $el.data('name') || '',
			description = $el.data('description') || '',
			link = $el.data('link') || '',
			caption = $el.data('caption') || '';

		// Open Facebook share dialog
		FB.ui({
			method: 'feed',
			name: name,
			link: link,
			picture: urls.theme + '/images/fb-share.jpg',
			caption: caption,
			description: description
		});

		// Track Facebook share button click
		ga('send', 'event', 'Facebook Share', 'click');

		return true;
	};

	/**
	 * Pops a Tweet dialog box using information from a button's data attributes
	 * @param  {object} el The target of the event
	 * @return {string}    The twitter url needed to pop the dialog with the correct info
	 */
	var twitterShare = function(el) {
		var $el = $(el),
			url = $el.data('url') || urls.base,
			text = $el.data('text') || '',
			hashtags = $el.data('hashtags') || '',
			tweeturl = 'http://twitter.com/share?url=' + encodeURI(url) + '&text=' + text + '&hashtags=' + hashtags;

		// Track tweet button click
		ga('send', 'event', 'Twitter Share', 'click');

		return tweeturl;
	};

	return {
		fbShare: fbShare,
		twitterShare: twitterShare
	}
})