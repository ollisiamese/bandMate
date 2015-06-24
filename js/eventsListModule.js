(function(){
    
    //	Create a module
	var evListModule = angular.module('eventsListModule', []);
    
    //	Add the main element (events-list) directive to this module
	evListModule.directive('eventsList', function() {
      
      return {
        
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/eventsList.html',
        controller: function($scope, $rootScope, search) {
           
			//	Initialize the 2 vars so that their corresponding div's are hidden
			$scope.showsAvailable	= false;
			$scope.errorMsg			= '';
			
			//	Event listener for fetching the artist data thatis emitted from mainController on successful search for artist name
			$rootScope.$on(
				
				'onArtistSuccess',
				function(event, data) {
					
					$scope.artistId		= data.id;
					$scope.artistName	= data.name;
					$scope.onTour		= data.onTour;

					//	If the main controller said artist is on tour, search for upcoming events,
					//	if not, then don't even search and display message that they re not on tour right away.
					if($scope.onTour) {
					
						//	Now can call $scope.searchEvents
						$scope.searchEvents($scope.artistId);
						
					} else {
				
						$scope.errorMsg = $scope.artistName + ' is not currently on tour. No upcoming events.';

						$scope.showsAvailable	= false;
					}
				}
			);
			
			/*
			$rootScope.$on(
				
				'onArtistFail',
				function() {
					//	Reset both flag vars so that nothing is shown inside the section
					$scope.errorMsg = '';
					$scope.showsAvailable	= false;
				}
			);
			*/
			$rootScope.$on(
				
				'clearContents',
				function() {
					//	Reset both flag vars so that nothing is shown inside the section
					$scope.errorMsg = '';
					$scope.showsAvailable	= false;
				}
			);
			
			//	Optional param pageNum - get the specific page in the search results 
			$scope.searchEvents = function(query, pageNum) {
				
				if(query && query.toString().length > 0) {
					
					if(pageNum) {
						//	This is technically not a search but a pagination navigation for user
						
						//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
						search.searchArtistEvents(query, $scope.handleEventsSearchSuccess, $scope.handleEventsSearchFailure, pageNum);
						
					} else {
						
						//	This is a new search
						
						//	Show the loading img while searching
						$scope.searching = true;
						
						/*
						//	Clear before the new search
						$scope.errorMsg = '';
						$scope.showsAvailable	= false;
						*/
						//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
						search.searchArtistEvents(query, $scope.handleEventsSearchSuccess, $scope.handleEventsSearchFailure);
					}
					
				} else {
			
					$scope.errorMsg			= "Apologies, your search could not be performed at this time";
					$scope.showsAvailable	= false;
				}
			
			};
			
			//	Callback function for handling the videos search results - SUCCESS
			$scope.handleEventsSearchSuccess = function(data) {
				console.log(data);
			
				//	Search is done, hide the loading img
				$scope.searching = false;
				
				if(data.resultsPage && data.resultsPage.results && parseInt(data.resultsPage.totalEntries, 10) > 0) {

					$scope.showsAvailable	= true;
					$scope.showsData		= data.resultsPage.results;
					$scope.totalEntries		= data.resultsPage.totalEntries;
					$scope.showsPerPage		= data.resultsPage.perPage;
					$scope.errorMsg			= '';
					
					//	If there are multiple pages in the result
					if($scope.totalEntries > $scope.showsPerPage) {
						
						$scope.currentPage = data.resultsPage.page;
						
						$scope.totalPages = Math.ceil($scope.totalEntries/$scope.showsPerPage);
						
						//	Will display pagination
						$scope.pagination = true;
						
						//	If currently are on page 1, show only NEXT btn
						if($scope.currentPage == 1) {
							
							$scope.nextPageBtn = true;
							$scope.prevPageBtn = false;
							
						} else if($scope.currentPage == $scope.totalPages) {
							
							//	If currently are on the last page, show only PREV btn
							$scope.nextPageBtn = false;
							$scope.prevPageBtn = true;
							
						} else {
							//	Otherwise, show both buttons
							$scope.nextPageBtn = true;
							$scope.prevPageBtn = true;
						}
					}
				
				} else {
				
					//	Successful request but nothing found
					$scope.showsAvailable	= false;
					$scope.errorMsg			= "The search returned no videos for \"" + $scope.artistName + "\"";
					$scope.showsData		= null;
				}
			};
			
			//	Callback function for handling the videos search results - FAILURE
			$scope.handleEventsSearchFailure = function(errorData) {
				
				//	Search is done, hide the loading img
				$scope.searching = false;
				
				//	Set an error message
				$scope.errorMsg				= "Apologies, your search could not be performed at this time";
				$scope.showsAvailable		= false;
				$scope.showsData			= null;
			};
		   
		   
        }// -end of controller
      };
        
      });
  
    
  })();