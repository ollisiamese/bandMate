(function(){
	//	Main app module
	var bandMateApp = angular.module('mainApp', ['playerModule', 'eventsListModule', 'videosListModule']);
	
	//	Main controller for the app (for the search area)
	bandMateApp.controller('mainController', ['$scope', 'search', function($scope, search) {
	
		$scope.searchYoutube = function() {
			if($scope.searchQueryString) {
				alert($scope.searchQueryString);
				//YoutubeArea.searchVideos(nameInputValue);
				search.greet();
			}
		};
	}]);
	
	//	Define 'search' service
	bandMateApp.factory('search', ['$http', function($http) {
	  
	function greet() {
	  
		alert('hi');
	};
	  
	return {
		
		greet: greet
	};
	
	}]);
	
	
})();