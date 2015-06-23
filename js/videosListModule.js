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

		   //	Event listener for fetching the artist data thatis emitted from mainController on successful search for artist name
		   $rootScope.$on(
				'onArtistSuccess',
				function(event, data) {
					
					$scope.artistName = data.name;
					
					//	Now can call $scope.searchYoutube
					 $scope.searchYoutube($scope.artistName);
				}
			);
		   
		   $scope.searchYoutube = function(query) {
				
				if(query && query.length > 0) {
					
					//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
					search.searchYoutubeVideos(query, $scope.handleVideosListSuccess, $scope.handleVideosListFailure);
				}
			};
		
			//	Callback function for handling the videos search results - SUCCESS
			$scope.handleVideosListSuccess = function(results) {
				$scope.videosList = results;
				console.log($scope.videosList);
			};
			
			//	Callback function for handling the videos search results - FAILURE
			$scope.handleVideosListFailure = function(errorData) {
				$scope.errorMessage = errorData;
				console.log($scope.errorMessage);
			};
		   
        } // -end of controller
      };
        
      });
  
    
  })();