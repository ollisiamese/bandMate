(function(){
	//	Main app module
	var bandMateApp = angular.module('mainApp', ['playerModule', 'eventsListModule', 'videosListModule', 'searchService', 'playerService']);
	
	//	Main controller for the app (for the search area)
	bandMateApp.controller('mainController', ['$scope', 'search', '$rootScope', function($scope, search, $rootScope) {
	
		//	Keep all areas' headers hidden until the first search is attempted
		$scope.areasInitialized = false;

		//	Initialize the 2 vars so that their corresponding div's are hidden
		$scope.artistAvailable	= false;
		$scope.errorMsg			= '';
		
		//	Method that searches for artist name provided by user in the input
		$scope.searchArtist = function() {

			//	Until the input is not blank, don't do anything
			if($scope.searchQueryString && $scope.searchQueryString.length > 0) {
				
				//	When starting a new search, tell the rest of the controllers to clear their contents
				$rootScope.$emit('clearContents');
				
				//	Show the loading img while searching
				$scope.searching = true;
				
				//	Clear the previous search data
				$scope.artistAvailable	= false;
				$scope.errorMsg			= '';
			
				search.searchArtist($scope.searchQueryString, $scope.artistSearchSuccessHandler, $scope.artistSearchErrorHandler);
				
				$scope.searchedName = $scope.searchQueryString;
				$scope.searchQueryString = '';
				$scope.searchForm.$setPristine();
			}
		};
		
		//	Callback function for successful artist search 
		$scope.artistSearchSuccessHandler = function(data) {

			//	Search is done, hide the loading img
			$scope.searching = false;
			
			console.log(data);
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
				
				//	Emit event 'onArtistSuccess' on the $rootScope so that the rest of the controllers can see the artist data and use it for their searches
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
				
				//	Don't show empty areas with just headers, hide the rest of the sections until the next search
				$scope.areasInitialized = false;
				
				/*
				//	If no artist was found, then cannot perform search for events (didn't obtain the ID and shouldn't search for videos either)
				$rootScope.$emit('onArtistFail');
				*/
			}
			
		};
		
		//	Callback function for error in artist search
		$scope.artistSearchErrorHandler = function(errorData) {

			//	Search is done, hide the loading img
			$scope.searching = false;
			
			//	Set an error message
			$scope.errorMsg				= "Apologies, your search could not be performed at this time";
			$scope.artistAvailable		= false;
			$scope.artistData			= null;
			
			//	Don't show empty areas with just headers, hide the rest of the sections until the next search
			$scope.areasInitialized = false;
			
		};
		
		
	}]);
	
	
})();