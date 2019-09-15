export async function getArtistsList(query) {
	return await fetch(`api/getArtistsList/${query}`)
		.then(res => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						//nothing fancy
						getArtistsList(query);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then(json => {
			if (json) {
				if (json.artists.items.length === 0) return false;
				return json.artists.items;
			}
		});
}

export async function getArtist(query) {
	return await fetch(`api/getArtist/${query}`)
		.then(res => {
			if (!res.ok) {
				if (res.status === 500) {
					setTimeout(() => {
						//nothing fancy
						getArtist(query);
					}, 3000);
				} else {
					throw Error(res.statusText);
				}
			}
			return res.json();
		})
		.then(json => {
			if (json) {
				if (json.length === 0) return false;
				return json;
			}
		});
}

export async function getAlbumList(artist) {
	return await fetch(`api/getAlbumList/${artist}`)
		.then(res => {
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
		.then(json => {
			if (json) {
				//rewrite this
				let result = json.items.filter(album => album.album_group === "album");
				if (result.length === 0)
					result = json.items.filter(album => album.album_group === "single");
				if (result.length === 0)
					result = json.items.filter(
						album => album.album_group === "compilation"
					);
				result = result.filter(album => !album.name.includes("Deluxe"));

				const names = [];
				result = result.filter(album => {
					const duplicate = names.includes(album.name);
					names.push(album.name);
					return !duplicate;
				});

				return result;
			}
		});
}

//rewrite the whole data thing
let data = { albums: [], tracks: [], features: [] };

export async function getAlbum(album) {
	data = { albums: [], tracks: [], features: [] };

	const tracks = await fetch(`api/getAlbum/${album}`)
		.then(res => {
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
		.then(json => {
			if (json) {
				data.albums.push(json);
				let tracks = json.tracks.items.map(track => track.id); //extract track id array from json
				return tracks;
			}
		})
		.catch(err => console.log(err));

	await getTracks(album, tracks);
	//so as to not hammer the server with requests
	await new Promise(resolve => setTimeout(resolve, 500));
	return data;
}

async function getTracks(album, tracks) {
	//have to do this because the spotify api doesn't return the popularity value in getAlbum requests
	await fetch(`api/getTracks/${album}/${tracks}`)
		.then(res => {
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
		.then(json => {
			if (json) data.tracks.push(...json);
		})
		.catch(err => console.log(err));

	await getAudioFeatures(album, tracks);
}

async function getAudioFeatures(album, tracks) {
	//for stuff like bpm, key, etc.
	await fetch(`api/getAudioFeatures/${album}/${tracks}`)
		.then(res => {
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
		.then(json => {
			if (json) data.features.push(...json);
		})
		.catch(err => console.log(err));
}
