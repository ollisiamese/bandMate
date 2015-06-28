(function() {
	'use strict';
	/**	Service that utilizes Youtube IFrame Player API	**/
	
	//	Declare the module
	var playerServiceModule = angular.module('playerService', []);
	
	//	Add the 'YtPlayer' service to the module
	playerServiceModule.factory('YtPlayer', function() {
		
		/**
		*	As soon as the page is loaded,
		*	this code loads the IFrame Player API code asynchronously.
		*
		**/
		function init() {
		
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];     
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
			//	Register 'event listener' for when the video player api becomes available. it HAS tobe a global function (per youtube docs)
			//	therefore, make it a window method
			window.onYouTubeIframeAPIReady = function() {
				
				console.log('player API ready');
				window.playerAPIReady = true;
			};
		};
		
		/**
		*	Fires when player is first created and starts playing the current video (the one that player was created with)
		*	@param event ev
		*
		**/
		function onPlayerReady(ev) {
		
			ev.target.playVideo();
		};
		
		/**
		*	Creates the player object, exposing its methods 
		*
		*	@param string vidId				- the video that player will play on its creation
		*	@param creationCallbackFn		- function that will be called after attemting to embed the iframe
		*	@param stateChangeCallbackFn	- function to be called on onStateChange player's event
		**/
		function createPlayerObject(vidId, creationCallbackFn, stateChangeCallbackFn) {
	
			var playerObject = new YT.Player('player', {
					height: '270',
					width: '480',
					videoId: vidId,
					events: {
						'onReady': onPlayerReady,
						'onStateChange': stateChangeCallbackFn
					}
			});
			
			//	Whether or not it was actually embedded, call the callback and let it handle success/error
			creationCallbackFn(playerObject);
		};
		
		/**
		*	Removes iframe of the playerObject that was passed to it
		*	@param object objectToDestroy
		*
		**/
		function destroyPlayerObject(objectToDestroy) {
			
			objectToDestroy.destroy();
		
		};
		
		//	Call init as soon as angular creates an instance of this service
		init();
	
	//	Expose public methods of this service
	return {
	
		createPlayerObject: createPlayerObject,
		destroyPlayerObject: destroyPlayerObject
	};
	
	});
	
})();