# bandMate
This app lets you search for a band (or any music artist) and view their upcoming performances and relevant YouTube videos.

The app is built with AngularJS and Bootstrap. 

BandMate uses 4 APIs:

YouTube IFrame Player API, 
YouTube Data API (v3), 
Songkick Artist Search API, 
Songkick Artist Calendar (Upcoming events) API.

When user enters the artist's name in the search box, a search for this artist is performed in the Songkick Atist database. 

If the artist is found, then their name and id are used to perform the videos search and upcoming events search respectively.

If the artist is not found, then the other two searches aren't initiated and user gets an 'artist not found' message.

The Events List section of the app displays a list of the upcoming events for the artist.
If an event is a festival or any other multi-artist event, then a 'Lineup' 
dropdown will be shown for that event, displaying all the announced performers.
There are 10 events listed per page.

In the Videos section, user can click on a video to play it in the video player. 
If a video is currently playing, user has an option to add other videos to the player's queue.
Player will keep playing through these videos until the queue is empty.
When the player's queue is not empty, the queued videos are displayed in 
a dropdown under the player iframe.
Any queued video can be removed from the queue from the dropdown.
Even if there are some videos currently queued, user still can click any video to play it instantly.
Once a video player is started, it will stay open while user performs other searches and queue manipulations, until user closes it
by clicking the "X" button near the player's top right corner (this will also clear the player's queue!) or end their session in the app.
The video results display 5 videos per page.

Demo: <a href='http://www.ogeinitz.com/bandMate' target='_blank'>BandMate</a>


