/* eslint-disable no-return-await */
export async function getArtistsList(query) {
	return await fetch(`api/getArtistsList/${query}`)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						// nothing fancy
						getArtistsList(query);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then((json) => {
			if (json) {
				if (json.artists.items.length === 0) return false;
				return json.artists.items;
			}
		});
}

export async function getArtist(query) {
	return await fetch(`api/getArtist/${query}`)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						// nothing fancy
						getArtist(query);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then((json) => {
			if (json) {
				if (json.length === 0) return false;
				return json;
			}
		});
}

export async function getAlbumList(artist) {
	return await fetch(`api/getAlbumList/${artist}`)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						getAlbumList(artist);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then((json) => {
			if (json) {
				const names = [];
				return json.items.filter((album) => {
					const duplicate =
						names.find(
							(a) =>
								a.includes(album.name) &&
								a.includes(album.release_date.slice(0, 4))
						) ||
						(album.release_date_precision === "day" &&
							names.find(
								(a) =>
									a.includes(album.name.split(" (")[0]) &&
									a.includes(album.release_date)
							));
					names.push(album.name + album.release_date);
					return !duplicate;
				});
			}
		});
}

// rewrite the whole data thing
let data = { albums: [], tracks: [], features: [] };

export async function getAlbum(album) {
	data = { albums: [], tracks: [], features: [] };

	const tracks = await fetch(`api/getAlbum/${album}`)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						getAlbum(album);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then((json) => {
			if (json) {
				// deluxe type for filter - not ideal but works
				const jsonRes =
					(json.name.includes("Deluxe") &&
						(json.name.includes("Edition") || json.name.includes("Version"))) ||
					json.name.includes("(Deluxe)")
						? { ...json, album_type: "deluxe" }
						: json;
				data.albums.push(jsonRes);
				const tracksRes = jsonRes.tracks.items.map((track) => track.id); // extract track id array from json
				return tracksRes;
			}
		})
		.catch((err) => console.log(err));

	await getTracks(album, tracks);
	// so as to not hammer the server with requests
	await new Promise((resolve) => setTimeout(resolve, 500));
	return data;
}

async function getTracks(album, tracks) {
	// have to do this because the spotify api doesn't return the popularity value in getAlbum requests
	await fetch(`api/getTracks/${album}/${tracks}`)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						this.getTracks(album, tracks);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then((json) => {
			if (json) data.tracks.push(...json);
		})
		.catch((err) => console.log(err));

	await getAudioFeatures(album, tracks);
}

async function getAudioFeatures(album, tracks) {
	// for stuff like bpm, key, etc.
	await fetch(`api/getAudioFeatures/${album}/${tracks}`)
		.then((res) => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						this.getAudioFeatures(album, tracks);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then((json) => {
			if (json) data.features.push(...json);
		})
		.catch((err) => console.log(err));
}
