## The Setlist Generator

### What is this?

This is a website consisting of a Javascript (React) frontend and Node backend for generating setlists for Spotify artists based on song popularity.

### What is this written in?

- Javascript (React),
- Node.js.

### What are some of the main features?

- Frontend (website):
  - Uses React with Material-UI to present a responsive and simple UI,
  - Provides search functionality to pick an artist,
  - The Song Pool section:
    - Presents the artist's albums in the form of a tree view with checkboxes, allowing to pick particular songs or entire albums to be added to the song pool (= songs eligible to be picked for use in a setlist),
    - Includes a search bar,
    - A portion of the most popular songs is pre-selected on first use.
  - The Staples section:
    - Presents a list of staples (= songs which are to be present in every setlist) and allows to remove them or add new ones via search bar,
    - Up to 10 most popular songs by the artist are pre-selected on first use.
  - The Setlist section:
    - Presents a setlist of up to 25 songs, picked by [Chance.js](https://chancejs.com/) using the songs from the song pool and their popularity index as weight,
    - Allows to copy the current setlist to the clipboard, generate a new setlist of a particular length, or add a new song to the existing setlist,
    - Allows songs to be locked (= to remain in their place when new setlists are generated),
    - Allows songs to be rearranged by utilizing drag-and-drop,
    - Provides details regarding each song (position in setlist, duration, album of origin and year of release, album cover, key, tempo, time signature),
    - Allows individual songs to be removed or replaced.
  - Provides a dynamically-updating album distibution donut chart and a table of setlist-related statistics,
  - Uses the Storage API to save the song pool, staples, locked songs, and setlist in local storage, per artist.
- Backend (server):
  - Uses Express to provide a simple API,
  - Uses lowdb for storing a temporary database of artists, albums, and songs,
  - Acquires the appropriate data by using [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node).

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

**[Check out this demo right here.](https://rowrawer.cf:5415/)**

### How do I launch this myself?

1. `git clone https://github.com/rowrawer/setlist-generator.git .`
2. `npm i`
3. `npm start`
