(function(){
    
    //	Create a module
	var vidListModule = angular.module('videosListModule', []);
    
    //	Add the main element (videos-list) directive to this module
	vidListModule.directive('videosList', function() {
      
		return {
        
			restrict: 'E',
			scope: {},
			templateUrl: 'templates/videosList.html',
			controller: function($scope, $rootScope, search) {

				//	Initialize the 2 vars so that their corresponding div's are hidden
				$scope.videosAvailable	= false;
				$scope.errorMsg			= '';
			   
			    //	Event listener for fetching the artist data thatis emitted from mainController on successful search for artist name
			    $rootScope.$on(
					
					'onArtistSuccess',
					function(event, data) {
						
						$scope.artistName = data.name;
						
						//	Now can call $scope.searchYoutube
						 $scope.searchYoutube($scope.artistName);
					}
				);
				
				/*
				$rootScope.$on(
					
					'onArtistFail',
					function() {
						//	Reset both flag vars so that nothing is shown inside the videos list section
						$scope.errorMsg = '';
						$scope.videosAvailable	= false;
					}
				);
				*/
				$rootScope.$on(
				
					'clearContents',
					function() {
						//	Reset both flag vars so that nothing is shown inside the videos list section
						$scope.errorMsg = '';
						$scope.videosAvailable	= false;
					}
				);
			   
			    //	Optional param pageToken for navigating through result pages
			    $scope.searchYoutube = function(query, pageToken) {
					
					if(query && query.length > 0) {
						
						if(pageToken) {
						
							//	This is technically not a search but a pagination navigation for user
							
							//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
							search.searchYoutubeVideos(query, $scope.handleVideosListSuccess, $scope.handleVideosListFailure, pageToken);
							
						} else {
						
							//	Show the loading img while searching
							$scope.searching = true;
							
							/*
							//	Clear before the new search
							$scope.errorMsg = '';
							$scope.videosAvailable	= false;
							*/
							//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
							search.searchYoutubeVideos(query, $scope.handleVideosListSuccess, $scope.handleVideosListFailure);
						}
						
					} else {
						
						$scope.errorMsg			= "Apologies, your search could not be performed at this time";
						$scope.videosAvailable	= false;
					}
				};
			
				//	Callback function for handling the videos search results - SUCCESS
				$scope.handleVideosListSuccess = function(results) {
					console.log(results);
					
					//	Search is done, hide the loading img
					$scope.searching = false;
					
					if(results.pageInfo.totalResults > 0) {

						$scope.videosAvailable	= true;
						$scope.videosData		= results.items;
						$scope.totalVideosFound = results.pageInfo.totalResults;
						$scope.pagingData		= {
							
							'prevPageToken': results.prevPageToken,
							'nextPageToken': results.nextPageToken
						};
						
						$scope.errorMsg			= '';
						console.log($scope.pagingData);
					
					} else {
					
						//	Successful request but nothing found
						$scope.videosAvailable	= false;
						$scope.errorMsg			= "The search returned no videos for \"" + $scope.artistName + "\"";
						$scope.videosData		= null;
					}
				};
				
				//	Callback function for handling the videos search results - FAILURE
				$scope.handleVideosListFailure = function(errorData) {
					
					//	Search is done, hide the loading img
					$scope.searching = false;
					
					//	Set an error message
					$scope.errorMsg				= "Apologies, your search could not be performed at this time";
					$scope.videosAvailable		= false;
					$scope.videosData			= null;
				};
			   
			} // -end of controller
		};
        
      });
  
    
  })();