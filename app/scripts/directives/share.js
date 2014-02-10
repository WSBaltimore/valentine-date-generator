'use strict';

app.directive('share', function ($window) {
	return {
		restrict: 'E',
		scope: {
			network: '@'
		},
		replace: true,
		template: '<span class="share" ng-click="shareContent()">{{network}}</span>',
		link: function (scope, element, attrs) {

			scope.shareContent = function () {
				if (attrs.network === 'facebook') {
					facebookShare();
				} else if (attrs.network === 'twitter') {
					twitterShare();
				}
			};

			/**
			 * Pops a Facebook 'share to wall' dialog using the element's data attributes
			 */
			var facebookShare = function () {
				// Open Facebook share dialog
				FB.ui({
					method: 'feed',
					name: attrs.title,
					link: attrs.link,
					picture: attrs.image,
					caption: attrs.caption,
					description: attrs.description
				});

				// Track Facebook share button click
				ga('send', 'event', 'Facebook Share', 'click');
			};


			/**
			 * Pops a Tweet dialog box using information from a button's data attributes
			 */
			var twitterShare = function() {
				var tweeturl = 'http://twitter.com/share?url=' + encodeURI(attrs.link) + '&text=' + attrs.description + '&hashtags=' + attrs.hashtags;

				// Track tweet button click
				ga('send', 'event', 'Twitter Share', 'click');

				$window.open(tweeturl);
			};


		}
	};
})