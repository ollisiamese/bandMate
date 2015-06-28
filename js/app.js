(function(){
	'use strict';
	//	Main app module with its dependencies on all the rest ofthe modules in the app
	var bandMateApp = angular.module('mainApp', ['eventsListModule', 'videosListModule', 'searchService', 'playerService']);
	
	//	Main controller for the app (for the artist search area/form)
	bandMateApp.controller('mainController', ['$scope', 'search', '$rootScope', function($scope, search, $rootScope) {
	
		//	For the footer
		$scope.year = (new Date()).getFullYear();
		
		//	Keep both events and videos areas' hidden until the first search is attempted
		$scope.areasInitialized = false;

		//	Initialize the 2 vars so that their corresponding div's are hidden
		$scope.artistAvailable	= false;
		$scope.errorMsg			= '';
		
		/**
		*	Searches for artist name provided by user in the input
		**/
		$scope.searchArtist = function() {

			//	Until the input is not blank, don't do anything
			if($scope.searchQueryString && $scope.searchQueryString.length > 0) {
				
				//	Show the loading img while searching
				$scope.searching = true;
				
				//	Clear the previous search data
				$scope.artistAvailable	= false;
				$scope.errorMsg			= '';
			
				//	Call the 'search' service's searchArtist() method, providing it with the query and the callbacks
				search.searchArtist($scope.searchQueryString, $scope.artistSearchSuccessHandler, $scope.artistSearchErrorHandler);
				
				$scope.searchedName = $scope.searchQueryString;
				
				//	Clear the form's input and validation
				$scope.searchQueryString = '';
				$scope.searchForm.$setPristine();
			}
		};
		
		/**
		*	Callback function for successful artist search
		*
		*	@param object data
		**/
		$scope.artistSearchSuccessHandler = function(data) {

			//	Search is done, hide the loading img
			$scope.searching = false;
			
			if(data.resultsPage && data.resultsPage.results && parseInt(data.resultsPage.totalEntries, 10) > 0) {
				
				//	After the first attempted search, keep the general areas 'visible' thoughout the session
				if(!$scope.areasInitialized) {
					
					$scope.areasInitialized = true;
				}
				
				$scope.artistAvailable	= true;
				
				//	Grab the first one as it is the most relevant one
				$scope.artistData		= data.resultsPage.results.artist[0];
				$scope.errorMsg			= '';
				
				var onTour = $scope.artistData.onTourUntil ? true : false;
				
				//	Emit event 'onArtistSuccess' on the $rootScope so that the rest of the controllers
				//	can see the artist data and use it for their searches
				$rootScope.$emit(
					
					'onArtistSuccess',
					{'id' 		: $scope.artistData.id,
					 'name'		: $scope.artistData.displayName,
					 'onTour'	: onTour
					}
				);

			} else {
			
				//	When request was successful but no artist under such name was found (example: 'muah')
				$scope.artistAvailable	= false;
				$scope.errorMsg			= "The search returned no artists named \"" + $scope.searchedName + "\"";
				$scope.artistData		= null;
				
				//	If no artist was found, then cannot perform search for events (didn't obtain the ID and shouldn't search for videos either)
				$rootScope.$emit('clearContents');
			}
		};
		
		/**
		*	Callback function for error in artist search
		*
		*	@param object errorData
		**/
		$scope.artistSearchErrorHandler = function(errorData) {

			//	Search is done, hide the loading img
			$scope.searching = false;
			
			//	Set an error message
			$scope.errorMsg				= "Apologies, your search could not be performed at this time";
			$scope.artistAvailable		= false;
			$scope.artistData			= null;
			
			//	If error in search occured, then cannot perform search for events
			//	(didn't obtain the ID and shouldn't search for videos either)
			$rootScope.$emit('searchError');
		};
	}]);

})();