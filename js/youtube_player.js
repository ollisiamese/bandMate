
 	//	As soon as the page is loaded,
	//	This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];     
	  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	 
	//	Register 'event listener' for when the video player api becomes available
    function onYouTubeIframeAPIReady() {
        
		
		console.log('player API ready, player itself is not yet...');		
      

	//	Set up the YoutubeArea.player: gets a reference to the object via new YT.Player
	//	Assign event listeners and methods			
		return YTPlayer = {
			
			//	Create the single player for the page, as property of the YoutubeArea object
			init: function(){
				
				this.player = new YT.Player('player', {
						height: '270',
						width: '480',
						videoId: '499P3qz2N0c',
						events: {
							'onReady': this.onPlayerReady,
							'onStateChange': this.onPlayerStateChange
						}
				});
				console.log('player inited');
				
			},
			
		  // The API will call this function when the video player is ready.
			onPlayerReady: function (event) {
				console.log('player ready!');
				event.target.playVideo();
				
				//	Player's internal functions (stopVideo(), etc. can be used at this point)
				YoutubeArea.playerReady = true;
				
				//YTPlayer.playCurrentPageVideos(["hJE3kk6v4C4","EyEB2AEqHxc"]); <- works!
				//YTPlayer.player.loadVideoById('hJE3kk6v4C4');// <- works!
				
			 },

			// The API calls this function when the player's state changes.
			//    The function indicates that when playing a video (state=1),
			//    the player should play for six seconds and then stop.
			//done: false,
			onPlayerStateChange: function(event) {
				  this.done=false;
				 // alert('onPlayerStateChange');
				if (event.data == YT.PlayerState.PLAYING && !done) {          
					//setTimeout(YTPlayer.stopVideo, 6000);
					this.done = true;
				}
			 },
			  
			stopVideo: function () {
				YTPlayer.player.stopVideo();
				YTPlayer.player.clearVideo();
				console.log(YTPlayer.player.clearVideo);
			 },
			 
			//	Plays a single video (when clicked, for example)
			loadVideo : function(id) {
				
				YTPlayer.player.loadVideoById(id);
			},
			  
			//	Plays all the videos in the array of video ids, in order
			playCurrentPageVideos: function(videoIdsArray) {
				  
				YTPlayer.player.loadPlaylist(videoIdsArray);				
			}
			
		};
	
	}
	
	

	
