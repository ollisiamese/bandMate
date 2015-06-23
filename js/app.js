(function(){
	//	Main app module
	var bandMateApp = angular.module('mainApp', ['playerModule', 'eventsListModule', 'videosListModule', 'searchService', 'playerService']);
	
	//	Main controller for the app (for the search area)
	bandMateApp.controller('mainController', ['$scope', 'search', '$rootScope', function($scope, search, $rootScope) {
	
		//	initialize the 2 vars as null so that their corresponding div's are hidden
		$scope.artistAvailable	= false;
		$scope.errorMsg			= '';
		
		//	Method that searches for artist name provided by user in the input
		$scope.searchArtist = function() {
			
			search.searchArtist($scope.searchQueryString, $scope.artistSearchSuccessHandler, $scope.artistSearchErrorHandler);
		};
		
		//	Callback function for successful artist search 
		$scope.artistSearchSuccessHandler = function(data) {
			console.log('success!');
			
			console.log(data);
			if(data.resultsPage && data.resultsPage.results && parseInt(data.resultsPage.totalEntries, 10) > 0) {
				
				$scope.artistAvailable = true;
				
				//	Grab the first one as it is the most relevant one
				$scope.artistData = data.resultsPage.results.artist[0];
				$scope.errorMsg = '';
				
				//	Emit event 'onArtistSuccess' on the $rootScope so that the rest of the controllers can see the artist data and use it for their searches
				$rootScope.$emit(
					'onArtistSuccess',
					{'id' 	: $scope.artistData.id,
					 'name'	: $scope.artistData.displayName
					}
				);
				
			} else {
			
				//	When request was successful but no artist under such name was found (example: 'muah')
				$scope.artistAvailable = false;
				$scope.errorMsg = "The search returned no artists named \"" + $scope.searchQueryString + "\"";
			}
			
			
		};
		
		//	Callback function for error in artist search
		$scope.artistSearchErrorHandler = function(errorData) {
			console.log('error!');
			
			//	Set an error message
			$scope.errorMsg = "Apologies, your search could not be performed at this time";
			$scope.artistAvailable = false;
			$scope.artistData = null;
		};
		
		
	}]);
	
	/*
	//	Define 'search' service
	bandMateApp.factory('search', ['$http', function($http) {
	  
	function greet() {
	  
		alert('hi');
	};
	  
	return {
		
		greet: greet
	};
	
	}]);
	*/
	
})();