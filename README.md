## The Setlist Generator
### What is this?
This is a website consisting of a Javascript (React) frontend and Node backend for generating setlists for Spotify artists based on song popularity.

### What is this written in?
- Javascript (React),
- Node.js.

### What are some of the main features?
- Frontend (website):
	* Uses React with Material-UI to present a responsive and simple UI,
	* Provides search functionality to pick an artist,
	* The Song Pool section:
		* Presents the artist's albums in the form of a tree view with checkboxes, allowing to pick particular songs or entire albums to be added to the song pool (= songs eligible to be picked for use in a setlist),
		* Includes a search bar,
		* A portion of the most popular songs is pre-selected on first use.
	* The Staples section:
		* Presents a list of staples (= songs which are to be present in every setlist) and allows to remove them or add new ones via search bar,
		* Up to 10 most popular songs by the artist are pre-selected on first use.
	* The Setlist section:
		* Presents a setlist of up to 25 songs, picked by [Chance.js](https://chancejs.com/) using the songs from the song pool and their popularity index as weight,
		* Allows to copy the current setlist to the clipboard, generate a new setlist of a particular length, or add a new song to the existing setlist,
		* Allows songs to be locked (= to remain in their place when new setlists are generated),
		* Allows songs to be rearranged by utilizing drag-and-drop,
		* Provides details regarding each song (position in setlist, duration, album of origin and year of release, album cover, key, tempo, time signature),
		* Allows individual songs to be removed or replaced.
	* Provides a dynamically-updating album distibution donut chart and a table of setlist-related statistics,
	* Uses the Storage API to save the song pool, staples, locked songs, and setlist in local storage, per artist.
- Backend (server):
	* Uses Express to provide a simple API,
	* Uses lowdb for storing a temporary database of artists, albums, and songs,
	* Acquires the appropriate data by using [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node).

### What's the point?
Having a simple tool for quickly generating, organizing, and saving one or more popularity-based setlists could be an extremely valuable tool to touring artists.

Also, practicing React, Node, responsive web design, and using external APIs.

### How do I use this?
1. Search for an artist, preferably with several albums available on Spotify,
2. Acquire setlist,
3. Pick different songs or staples to use (optional),
4. Generate a new setlist (optional),
5. Copy setlist to clipboard (optional).

### Where can I use this?
There will soon be a demo link here.

### How do I launch this myself?
1. `git clone https://github.com/rowrawer/setlist-generator.git .`
2. `npm i`
3. `npm start`

---

### Future plans and things to do
- [ ] Upload demo,
- [ ] Generate setlists/pick songs based on other factors (danceability, valence, etc.) provided by Spotify? The songs all seem to provide similar values in this department,
- [ ] Add more stats to the song features table (year of release?)
- [ ] Integrate with Setlist.fm stats?

### Additional notes
This tool was initially inspired by Rivers Cuomo, the frontman of the band Weezer, who spoke in interviews about developing a "setlist algorithm" or "setlist generator" several times[^1][^2][^3][^4] seemingly without actually implementing it in any meaningful way - this led to the creation of the first iteration of this project, the *Terrible Weezer Setlist Generator*, written entirely in pure Javascript, and without any backend to speak of. This repo contains the second, rewritten version of the tool.

[^1]: [Rivers Cuomo on His Data-Driven Approach to Weezer](https://www.billboard.com/articles/columns/rock/8500614/weezer-rivers-cuomo-data-driven-approach-interview)
[^2]: [Inside Weezer’s Set List Science](https://www.rollingstone.com/music/music-features/weezer-setlist-rivers-cuomo-interview-760114/)
[^3]: [How Rivers Cuomo will use a computer program to take Weezer’s tour to the next level](https://ew.com/article/2016/05/16/weezer-summer-tour-rivers-cuomo/)
[^4]: [Rivers Cuomo on Twitter: "Developing a sick setlist algorithm."](https://twitter.com/riverscuomo/status/931563545359208450)
