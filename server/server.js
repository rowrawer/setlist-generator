require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const SpotifyWebApi = require("spotify-web-api-node");

const port = process.env.PORT || 4515;

let db = {
	albums: [],
	tracks: [],
	features: [],
	albumList: [],
	artistsList: [],
	artist: []
};

const deleteInterval = 21600000;
const cleanup = () => {
	db = {
		albums: [],
		tracks: [],
		features: [],
		albumList: [],
		artistsList: [],
		artist: []
	};
};
setInterval(cleanup, deleteInterval);

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.REACT_APP_CLIENTID,
	clientSecret: process.env.REACT_APP_CLIENTSECRET
});

function getCredentials() {
	spotifyApi.clientCredentialsGrant().then(
		data => {
			spotifyApi.setAccessToken(data.body["access_token"]);
		},
		err => {
			throw err;
		}
	);
}
//renew token every 59 minutes
getCredentials();
setInterval(getCredentials, 3540000);

app.use(helmet());

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("oh no error");
});

app.get("/api/getTracks/:album/:id", (req, res, next) => {
	//timestamp used to send results cached by the server

	const dbTracks = db.tracks[req.params.album];

	if (dbTracks && Date.now() - dbTracks.timestamp < 21600000) {
		res.send(dbTracks.body);
	} else {
		spotifyApi
			.getTracks(req.params.id.split(","))
			.then(
				data => {
					db.tracks[req.params.album] = {
						body: data.body.tracks,
						timestamp: Date.now()
					};
					res.send(data.body.tracks);
				},
				err => {
					next(err);
				}
			)
			.catch(err => next(err));
	}
});

app.get("/api/getAudioFeatures/:album/:id", (req, res, next) => {
	const dbFeatures = db.features[req.params.album];

	if (dbFeatures && Date.now() - dbFeatures.timestamp < 21600000) {
		res.send(dbFeatures.body);
	} else {
		spotifyApi
			.getAudioFeaturesForTracks(req.params.id.split(","))
			.then(
				data => {
					db.features[req.params.album] = {
						body: data.body.audio_features,
						timestamp: Date.now()
					};
					res.send(data.body.audio_features);
				},
				err => {
					next(err);
				}
			)
			.catch(err => next(err));
	}
});

app.get("/api/getAlbum/:id", (req, res, next) => {
	const dbAlbums = db.albums[req.params.id];

	if (dbAlbums && Date.now() - dbAlbums.timestamp < 21600000) {
		res.send(dbAlbums.body);
	} else {
		spotifyApi
			.getAlbum(req.params.id)
			.then(
				data => {
					db.albums[req.params.id] = {
						body: data.body,
						timestamp: Date.now()
					};
					res.send(data.body);
				},
				err => {
					throw err;
				}
			)
			.catch(err => next(err));
	}
});

app.get("/api/getAlbumList/:id", (req, res, next) => {
	const dbAlbumList = db.albumList[req.params.id];

	if (dbAlbumList && Date.now() - dbAlbumList.timestamp < 21600000) {
		res.send(dbAlbumList.body);
	} else {
		spotifyApi
			.getArtistAlbums(req.params.id, {
				country: "US",
				limit: 50
			})
			.then(
				data => {
					db.albumList[req.params.id] = {
						body: data.body,
						timestamp: Date.now()
					};
					res.send(data.body);
				},
				err => {
					throw err;
				}
			)
			.catch(err => next(err));
	}
});

app.get("/api/getArtist/:id", (req, res, next) => {
	const dbArtist = db.artist[req.params.id];

	if (dbArtist && Date.now() - dbArtist.timestamp < 21600000) {
		res.send(dbArtist.body);
	} else {
		spotifyApi
			.getArtist(req.params.id)
			.then(
				data => {
					db.artist[req.params.id] = {
						body: data.body,
						timestamp: Date.now()
					};
					res.send(data.body);
				},
				err => {
					throw err;
				}
			)
			.catch(err => next(err));
	}
});

app.get("/api/getArtistsList/:id", (req, res, next) => {
	const dbArtistsList = db.artistsList[req.params.id];

	if (dbArtistsList && Date.now() - dbArtistsList.timestamp < 21600000) {
		res.send(dbArtistsList.body);
	} else {
		spotifyApi
			.searchArtists(req.params.id, {
				limit: 10
			})
			.then(
				data => {
					db.artistsList[req.params.id] = {
						body: data.body,
						timestamp: Date.now()
					};
					res.send(data.body);
				},
				err => {
					throw err;
				}
			)
			.catch(err => next(err));
	}
});

app.get("/*", (req, res) => {
	res.status(403).send("absolutely not");
});

app.post("/*", (req, res) => {
	res.status(403).send("absolutely not");
});

app.listen(port, "localhost", () => console.log(`listening on port ${port}`));
