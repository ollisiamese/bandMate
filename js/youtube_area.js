var YoutubeArea = (function(){
	
	return YoutubeArea = {
		
		nextPageToken: '',
		prevPageToken: '',
		
		playerReady: false,
		
		
		searchVideos: function(bandName){
			
			//	If had previously embedded the video, clear it now,
			//	because depending on the search results, might need to not have it
			
			if(YTPlayer && YTPlayer.player) {
				YTPlayer.player.destroy();
			}
			
			
			//	Reset the prev and next page tokens:
			this.nextPageToken = '';
			this.prevPageToken = '';
			
			//	Get reference to the api key
			var apiKey = ApiKeys.YOUTUBE;
			 console.log('searching for: '+ bandName);
			//	Make ajax request
			$.ajax({
				url: 'https://www.googleapis.com/youtube/v3/search',
				data: {
					part: 'snippet',
					order: 'relevance',
					//publishedAfter: format:RFC 3339 formatted date-time value (1970-01-01T00:00:00Z)
					q: bandName,
					type: 'video',
					key: apiKey
				},
				success: function(data) {
					console.log(data);
					
					//	Make sure the search result is not empty
					if(data.items && data.items.length > 0) {
						
						//	Init the player - create a new object and embed
						if(YTPlayer) {
							YTPlayer.init();
						}
						YoutubeArea.nextPageToken = data.nextPageToken || '';
						YoutubeArea.prevPageToken = data.prevPageToken || '';
						
						//	Cover scenario when the next page or prev page are empty
						//	(the 'edges') - don't make that button in the view!
						//	use the token as value for  'pageToken' param
						//	data.pageInfo.totalResults  - how many found total.
					
						YoutubeArea.currentPageItems = data.items;
						YoutubeArea.currentPageVideoIds = [];
						
						
						
						for(var i = 0; i < YoutubeArea.currentPageItems.length; i++) {
							YoutubeArea.currentPageVideoIds.push(YoutubeArea.currentPageItems[i].id.videoId);			
						}
						console.log(YoutubeArea.currentPageVideoIds);
						
					}
					
				},
				error: function(err) {console.log(err)}
				
				
				
			}).done(function(){alert('completed youtube vid retrieval');});
			
		}
		
		
		
	};
	
})();