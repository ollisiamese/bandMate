(function(){
    
    //	Create a module
	var evListModule = angular.module('eventsListModule', []);
    
    //	Add the main element (<events-list>) directive to this module
	evListModule.directive('eventsList', function() {
      
		return {
			
			restrict: 'E',
			
			//	Has isolate scope (that doesn't inherit from its parent scope)
			scope: {},
			templateUrl: 'templates/eventsList.html',
			
			//	Pass in the dependencies on services and scopes
			controller: function($scope, $rootScope, search) {
			   
				//	Initialize the 2 vars so that their corresponding div's are hidden
				$scope.showsAvailable	= false;
				$scope.errorMsg			= '';
				
				//	Event listener for fetching the artist data that is emitted from mainController on successful search for artist name
				$rootScope.$on('onArtistSuccess', function(event, data) {
						
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
				
				//	On empty search results in the mainController, receives 'clearContents' event
				$rootScope.$on('clearContents', function() {
					
						$scope.errorMsg = '';
						$scope.showsAvailable	= false
					}
				);
				
				//	On error in search in the mainController, receives 'searchError' event
				$rootScope.$on('searchError', function() {
					
					$scope.$apply(function() {

						$scope.errorMsg = '';
						$scope.showsAvailable	= false;
					});
				});
				
				/**
				*	Controller's function that searches for Upcoming events
				*
				*	@param query
				*	@param (optional) pageNum - get the specific page in the search results
				**/
				$scope.searchEvents = function(query, pageNum) {
					
					if(query && query.toString().length > 0) {
						
						if(pageNum) {
							
							//	This is technically not a search but a pagination navigation for user
							
							//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
							search.searchArtistEvents(query, $scope.handleEventsSearchSuccess, $scope.handleEventsSearchFailure, pageNum);
							
						} else {
							
							//	This is a new search
							
							//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
							search.searchArtistEvents(query, $scope.handleEventsSearchSuccess, $scope.handleEventsSearchFailure);
						}
						
					} else {
				
						$scope.errorMsg			= "Apologies, your search could not be performed at this time";
						$scope.showsAvailable	= false;
					}
				
				};
				
				/**
				*	Callback function for handling the videos search results - SUCCESS
				*	@param object data
				**/
				$scope.handleEventsSearchSuccess = function(data) {
					
					if(data.resultsPage && data.resultsPage.results && parseInt(data.resultsPage.totalEntries, 10) > 0) {

						$scope.showsAvailable	= true;
						$scope.showsData		= data.resultsPage.results.event;
						$scope.totalEntries		= data.resultsPage.totalEntries;
						$scope.showsPerPage		= data.resultsPage.perPage;
						$scope.errorMsg			= '';
						
						//	If there are multiple pages in the result
						if($scope.totalEntries > $scope.showsPerPage) {
							
							$scope.currentPage	= data.resultsPage.page;
							
							$scope.totalPages	= Math.ceil($scope.totalEntries/$scope.showsPerPage);
							
							//	Will display pagination
							$scope.pagination	= true;
							
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
				
				/**
				*	Callback function for handling the videos search results - FAILURE
				*	@param object errorData
				**/
				$scope.handleEventsSearchFailure = function(errorData) {
					
					//	Set an error message
					$scope.errorMsg				= "Apologies, your search could not be performed at this time";
					$scope.showsAvailable		= false;
					$scope.showsData			= null;
				};

			}// -end of controller
		}; 
    });
	  
	//	Add <concert> directive to the module (individual upcoming event)
	evListModule.directive('concert', function() {
		
		return {
			
			//	Depends on the controller from the eventsList directive
			require: '^eventsList',
			restrict: 'E',
			templateUrl: "templates/concert.html"
		};
	});

})();