(function() {
	//	Search service that utilizes 3 APIs: Youtube Data API, Songkick Artist Search, and Songkick Artist Calendar 
	
	var searchServiceModule = angular.module('searchService', []);
	
	searchServiceModule.factory('search', ['$http', function($http) {
	  
	function greet() {
	  
		alert('hi');
	};
	
	//	Optional param pageToken for retrieving next/prev videos
	function searchYoutubeVideos(bandName, successCallback, errorCallback, pageToken) {
		
		var apiKey = API_KEYS.YouTube_key;
		
		var searchUrl = 'https://www.googleapis.com/youtube/v3/search';
		
		if(pageToken) {
			
			searchUrl += '?pageToken=' + pageToken;
		}
		
		var req = {
			url: searchUrl,//'https://www.googleapis.com/youtube/v3/search',
			method: 'GET',
			params: {
				
				part		: 'snippet',
				order		: 'relevance',
				//publishedAfter: format:RFC 3339 formatted date-time value (1970-01-01T00:00:00Z)
				q			: bandName + ' artist',
				type		: 'video',
				key			: apiKey
			},
		};
		
		$http(req)
		.success(function(data) {successCallback(data);})
		.error(function(err) {errorCallback(err);});
	
	};
	
	
	function searchArtist(artistName, successCallback, errorCallback) {
		
		var apiKey = API_KEYS.Songkick_key;
		
		var req = {
			url				: 'http://api.songkick.com/api/3.0/search/artists.json',
			method			: 'GET',
			params			: {
				
							query: artistName,
							apikey: apiKey
						},
		};
		
		$http(req)
		.success(function(data) {successCallback(data);})
		.error(function(err) {errorCallback(err);});
		
	};
	
	
	function searchArtistEvents(artistId, successCallback, errorCallback, pageNum) {
	
		var apiKey = API_KEYS.Songkick_key;
		
		var searchUrl = 'http://api.songkick.com/api/3.0/artists/' + artistId + '/calendar.json';
		
		if(pageNum) {
		
			searchUrl += '?page=' + pageNum;
		}
		
		var req = {
			url				: searchUrl,
			method			: 'GET',
			params			: {
							
							//	As a rule in this app, retrieve 10 shows per page
							per_page: 10, 
							apikey	: apiKey
						},
		};
		
		$http(req)
		.success(function(data) {successCallback(data);})
		.error(function(err) {errorCallback(err);});
	
	};
	  
	return {
		
		greet				: greet,
		searchArtist		: searchArtist,
		searchYoutubeVideos	: searchYoutubeVideos,
		searchArtistEvents	: searchArtistEvents
	};
	
	}]);
	
})();