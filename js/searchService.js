(function() {
	'use strict';
	
	/**	Search service that utilizes 3 APIs: Youtube Data API (v3), Songkick Artist Search, and Songkick Artist Calendar (Upcoming events) **/
	
	//	Declare the module
	var searchServiceModule = angular.module('searchService', []);
	
	//	Add the 'search' service to the module
	searchServiceModule.factory('search', ['$http', function($http) {
	
		/**
		*	Searches for YouTube videos
		*
		*	@param (optional) string pageToken - for retrieving next/prev videos pages
		*	@param string bandName - the query to search for
		*	@param function successCallback - fn to call on successful $http request
		*	@param function errorCallback - fn to call on error of the $http request
		*/
		function searchYoutubeVideos(bandName, successCallback, errorCallback, pageToken) {
			
			var apiKey = API_KEYS.YouTube_key;
			
			var searchUrl = 'https://www.googleapis.com/youtube/v3/search';
			
			if(pageToken) {
				
				searchUrl += '?pageToken=' + pageToken;
			}
			
			var req = {
				
				url: searchUrl,
				method: 'GET',
				params: {
					
					part		: 'snippet',
					order		: 'relevance',
					//	Adding 'artist' to the youtube search query to make search more precise since this app 
					//	only searches for musicians
					q		: bandName + ' artist',
					type		: 'video',
					key		: apiKey
				},
			};
			
			
			$http(req)
			.success(function(data) {successCallback(data);})
			.error(function(err) {errorCallback(err);});
			
		};
	
		/**
		*	Searches for Artists on Songkick
		*
		*	@param string artistName - the query to search for
		*	@param function successCallback - fn to call on successful $http request
		*	@param function errorCallback - fn to call on error of the $http request
		*/
		function searchArtist(artistName, successCallback, errorCallback) {
			
			var apiKey = API_KEYS.Songkick_key;
			
			var searchUrl = 'http://api.songkick.com/api/3.0/search/artists.json?query='
							+ artistName
							+ '&apikey=' +apiKey
							+ '&jsoncallback=JSON_CALLBACK';
		
			$http.jsonp(searchUrl)
			.success(function(data) {successCallback(data);})
			.error(function(err) {errorCallback(err);});
		};
		
		
		/**
		*	Searches for Artist's upcoming events on Songkick
		*
		*	@param (optional) int pageNum - for retrieving next/prev pages
		*	@param string artistId
		*	@param function successCallback - fn to call on successful $http request
		*	@param function errorCallback - fn to call on error of the $http request
		*/
		function searchArtistEvents(artistId, successCallback, errorCallback, pageNum) {
		
			var apiKey = API_KEYS.Songkick_key;
			
			var searchUrl = 'http://api.songkick.com/api/3.0/artists/'
							+ artistId
							+ '/calendar.json'
							+ '?per_page=10'
							+ '&apikey=' + apiKey;
			
			if(pageNum) {
			
				searchUrl += '&page=' + pageNum;
			}
			
			searchUrl += '&jsoncallback=JSON_CALLBACK';
			
			$http.jsonp(searchUrl)
			.success(function(data) {successCallback(data);})
			.error(function(err) {errorCallback(err);});
		};
	  
		//	Expose public methods of the service
		return {
			
			searchArtist		: searchArtist,
			searchYoutubeVideos	: searchYoutubeVideos,
			searchArtistEvents	: searchArtistEvents
		};
	
	}]);
	
})();
