(function(){
    'use strict';
    //	Create a module
	var vidListModule = angular.module('videosListModule', []);
    
    //	Add the main element (<videos-list>) directive to this module
	vidListModule.directive('videosList', function() {
      
		return {
        
			restrict: 'E',
			
			//	Has isolate scope (that doesn't inherit from its parent scope)
			scope: {},
			templateUrl: 'templates/videosList.html',
			
			//	Pass in the dependencies on services and scopes
			controller: function($scope, $rootScope, search, YtPlayer) {

				//	Initialize the 2 vars so that their corresponding div's are hidden
				$scope.videosAvailable	= false;
				$scope.errorMsg			= '';
				
				//	Initialize reference to player as null
				$scope.playerObject		= null;
				
				//	Initialize videos queue as an empty Array
				$scope.videoQueue = [];
			   
			    //	Event listener for fetching the artist data that is emitted from mainController on successful search for artist name
			    $rootScope.$on('onArtistSuccess', function(event, data) {
						
						$scope.artistName = data.name;
						
						//	Now can call $scope.searchYoutube
						$scope.searchYoutube($scope.artistName);
					}
				);
				
				
				//	On empty search results in the mainController, receives 'clearContents' event
				$rootScope.$on('clearContents', function() {
						
						$scope.errorMsg = '';
						$scope.videosAvailable	= false;
					}
				);
				
				//	On error in search in the mainController, receives 'searchError' event
				$rootScope.$on('searchError', function(){
					
					$scope.$apply(function() {
				
						$scope.errorMsg = '';
						$scope.videosAvailable	= false;
					});
				});
			   
			    /**
				*	Controller's function that searches Youtube videos
				*
				*	@param string query
				*	@param (optional) pageToken for navigating through result pages
				*
				**/
			    $scope.searchYoutube = function(query, pageToken) {
					
					if(query && query.length > 0) {
						
						if(pageToken) {
						
							//	This is technically not a search but a pagination navigation for user
							
							//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
							search.searchYoutubeVideos(query, $scope.handleVideosListSuccess, $scope.handleVideosListFailure, pageToken);
							
						} else {
							
							//	A new search
							
							//	Execute call to the search service, providing it 2 callbacks - one for success, one for error. (methods of this controller)
							search.searchYoutubeVideos(query, $scope.handleVideosListSuccess, $scope.handleVideosListFailure);
						}
						
					} else {
						
						$scope.errorMsg			= "Apologies, your search could not be performed at this time";
						$scope.videosAvailable	= false;
					}
				};
			
				/**
				*	Callback function for handling the videos search results - SUCCESS
				*	@param object results
				**/
				$scope.handleVideosListSuccess = function(results) {
					
					if(results.pageInfo.totalResults > 0) {

						$scope.videosAvailable	= true;
						$scope.videosData		= results.items;
						$scope.totalVideosFound = results.pageInfo.totalResults;
						
						$scope.pagingData		= {
							
							'prevPageToken': results.prevPageToken,
							'nextPageToken': results.nextPageToken
						};
						
						$scope.errorMsg			= '';

					} else {
					
						//	Successful request but nothing found
						$scope.videosAvailable	= false;
						$scope.errorMsg			= "The search returned no videos for \"" + $scope.artistName + "\"";
						$scope.videosData		= null;
					}
				};
				
				/**
				*	Callback function for handling the videos search results - FAILURE
				*	@param object errorData
				**/
				$scope.handleVideosListFailure = function(errorData) {
					
					//	Set an error message
					$scope.errorMsg				= "Apologies, your search could not be performed at this time";
					$scope.videosAvailable		= false;
					$scope.videosData			= null;
				};
				
				/**
				*	Called when a video is clicked to be played
				*	If player object is not yet embedded, tries to embed it (calls the playerService's createPlayerObject() fn)
				*	If player iframe already exists, makes a call to playerService's loadVideoById()
				*
				*	@param int id
				**/
				$scope.playClickedVideo = function(id) {
					
					//	If player API is ready for use
					if(playerAPIReady) {
					
						//	If player object doesn't yet exist, create it now (video will be automatically played)
						if(!$scope.playerObject) {
							
							YtPlayer.createPlayerObject(id, $scope.playerCreatedCallback, $scope.monitorPlayerQueue);
						
						} else {
							
							//	If player object already exists, just load the video and play it
							$scope.playerObject.loadVideoById({videoId: id});
						}
						
					} else {
						
						//	The player API isn't even available, so impossible to embed an iframe
						$scope.playerErrorMessage = 'Oops, something went wrong and player could not be shown. Please try to refresh the page.';
					}
				};
				
				
				/**
				*	Handles the result of attempting to embed the video player (acts as a callback for playerService's createPlayerObject())
				*	@param vidPlayer which is the newly created player object
				**/
				$scope.playerCreatedCallback = function(vidPlayer) {
				
					//	If element iframe exists (and this app will only ever have one), then player was embedded successfully
					if(document.querySelector('iframe')) {
					
						//	Add the necessary class to the iframe for the responsive embed
						document.querySelector('iframe').className += 'embed-responsive-item';
						document.getElementById('responsiveWrapper').className = 'embed-responsive embed-responsive-16by9';
						
						$scope.playerErrorMessage	= '';
						
						//	Save the reference to the player to use
						$scope.playerObject			= vidPlayer;
						
						//	Player is embedded and since it was just created, it is playing the video it was created with, so enable queuing
						$scope.enableQueue = true;
						
					} else {
						
						//	Failed to embed player
						$scope.playerErrorMessage = 'Oops, something went wrong and player could not be shown. Please try to refresh the page.';
					}
				};
				
				/**
				*	Adds the clicked video object to queue
				*	@param object videoObject - example: {id: '10', title: 'songTitle'}
				*
				**/
				$scope.addVideoToQueue = function(videoObject) {
				
					$scope.videoQueue.push(videoObject);
				};
				
				/**
				*	A callback function provided to the player iframe on its creation 
				*	for handlign of the player's state change.
				*	Every time a YT.PlayerState.ENDED state is broadcasted, checks to see if there are any video ids left in the queue
				*	and if there are, grabs the next one and loads that video
				*
				*	@param event ev
				**/
				$scope.monitorPlayerQueue = function(ev) {

					//	If a video has just ended playing, check the player queue and play the next video in it
					if(ev.data === YT.PlayerState.ENDED) {
					
						if($scope.videoQueue.length > 0) {
						
							//	Grab the first video in the queue and then remove it from the queue for the next round
							var nextVideoId = $scope.videoQueue[0].id;
							
							//	Wrap in $apply so that the bindings connected to the $scope.enableQueue var update
							$scope.$apply(function(){
								
								$scope.videoQueue.shift();
								
								//	Since will be playing one more video, queueing functionality for the user should be enabled
								$scope.enableQueue = true;
							});
							
							$scope.playerObject.loadVideoById({videoId: nextVideoId});

						} else {
							
							//	If no videos left in the queue, since video just ended playing, queuing functionality for the user should be hidden 
							//	until they click on another video and it starts playing
							
							//	Force update on the bindings connected to the  $scope.enableQueue var
							$scope.$apply(function(){
							
								$scope.enableQueue = false;
							});
						}
						
					} else {
					
						//	When player's state changes to any of the below, enable video queuing functionality for the user
						if(ev.data === YT.PlayerState.PLAYING || ev.data === YT.PlayerState.PAUSED || ev.data === YT.PlayerState.BUFFERING) {
							
							//	Force update on the bindings connected to the $scope.enableQueue var
							$scope.$apply(function(){
								
								$scope.enableQueue = true;
							});
						}
					}
				};
				
				/**
				*	Removes an item from the player queue
				*
				*	@param event ev - to stop event propagation and keep the queued videos dropdown open
				*	@param vidId
				**/
				$scope.removeItemFromQueue = function(ev, vidId) {
					
					for(var i = 0; i < $scope.videoQueue.length; i++) {
						
						if($scope.videoQueue[i].id == vidId) {
							
							$scope.videoQueue.splice($scope.videoQueue[i], 1);
							break;
						}
					}
					
					ev.originalEvent.stopPropagation();
				};
				
				/**
				*	Clears the player's queue
				**/
				$scope.clearQueue = function() {
					
					$scope.videoQueue = [];
				};
				
				/**
				*	'Closes' player (destroys iframe) and clears the player queue
				**/
				$scope.closePlayer = function() {
					
					//	Calls the YtPlayer service to destroy the player object/remove iframe
					YtPlayer.destroyPlayerObject($scope.playerObject);
					
					//	Clear the refrence to the player object in this scope
					$scope.playerObject = null;
					
					$scope.videoQueue = [];
					
					document.getElementById('responsiveWrapper').className = '';
					
					$scope.enableQueue = false;
				};
			} // -end of controller
		};
    });
	
	//	Add <video-item> directive to the module (individual video)
	vidListModule.directive('videoItem', function() {
		
		return {
			
			//	Depends on the controller of the videosList directive
			require: '^videosList',
			restrict: 'E',
			templateUrl: "templates/video-item.html"
		};
	});
	
})();