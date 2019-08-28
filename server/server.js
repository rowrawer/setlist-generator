require("dotenv").config();
const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = low(adapter);
db.defaults({
	albums: [],
	tracks: [],
	features: [],
	albumList: [],
	artistsList: [],
	artist: []
}).write();

const port = process.env.PORT || 4515;

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

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("oh no error");
});

app.get("/api/getTracks/:album/:id", (req, res, next) => {
	//timestamp used to send results cached by the server

	const dbTracks = db
		.get("tracks")
		.find({ id: req.params.album })
		.value();

	if (dbTracks && Date.now() - dbTracks.timestamp < 21600000) {
		res.send(dbTracks.body);
	} else {
		spotifyApi
			.getTracks(req.params.id.split(","))
			.then(
				data => {
					db.get("tracks")
						.push({
							id: req.params.album,
							timestamp: Date.now(),
							body: data.body.tracks
						})
						.write();
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
	const dbFeatures = db
		.get("features")
		.find({ id: req.params.album })
		.value();

	if (dbFeatures && Date.now() - dbFeatures.timestamp < 21600000) {
		res.send(dbFeatures.body);
	} else {
		spotifyApi
			.getAudioFeaturesForTracks(req.params.id.split(","))
			.then(
				data => {
					db.get("features")
						.push({
							id: req.params.album,
							timestamp: Date.now(),
							body: data.body.audio_features
						})
						.write();
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
	const dbAlbums = db
		.get("albums")
		.find({ id: req.params.id })
		.value();

	if (dbAlbums && Date.now() - dbAlbums.timestamp < 21600000) {
		res.send(dbAlbums.body);
	} else {
		spotifyApi
			.getAlbum(req.params.id)
			.then(
				data => {
					db.get("albums")
						.push({
							id: req.params.id,
							timestamp: Date.now(),
							body: data.body
						})
						.write();
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
	const dbAlbumList = db
		.get("albumList")
		.find({ id: req.params.id })
		.value();

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
					db.get("albumList")
						.push({
							id: req.params.id,
							timestamp: Date.now(),
							body: data.body
						})
						.write();
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
	const dbArtist = db
		.get("artist")
		.find({ id: req.params.id })
		.value();

	if (dbArtist && Date.now() - dbArtist.timestamp < 21600000) {
		res.send(dbArtist.body);
	} else {
		spotifyApi
			.getArtist(req.params.id)
			.then(
				data => {
					db.get("artist")
						.push({
							id: req.params.id,
							timestamp: Date.now(),
							body: data.body
						})
						.write();
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
	const dbArtistsList = db
		.get("artistsList")
		.find({ id: req.params.id })
		.value();

	if (dbArtistsList && Date.now() - dbArtistsList.timestamp < 21600000) {
		res.send(dbArtistsList.body);
	} else {
		spotifyApi
			.searchArtists(req.params.id, {
				limit: 10
			})
			.then(
				data => {
					db.get("artistsList")
						.push({
							id: req.params.id,
							timestamp: Date.now(),
							body: data.body
						})
						.write();
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
