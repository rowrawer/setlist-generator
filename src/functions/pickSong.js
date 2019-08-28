import Chance from "chance";

const chance = new Chance();

export function pickSong(tracks, features, checked, setlist) {
	const trackList = tracks.filter(track => {
		return checked.includes(track.id) && !setlist.includes(track.id);
	});

	const trackIds = trackList.map(track => track.id);
	const trackWeight = trackList.map(track => track.popularity);

	const newTrack = chance.weighted(trackIds, trackWeight);

	const track = tracks.find(track => track.id === newTrack);

	const feature = features.find(e => e.id === track.id);

	return {
		id: newTrack,
		node: {
			id: track.id,
			name: track.name,
			pos: setlist.indexOf(track.id) + 1 || setlist.length + 1,
			duration_ms: track.duration_ms,
			album: track.album,
			key: feature.key,
			mode: feature.mode,
			tempo: feature.tempo,
			time_signature: feature.time_signature
		}
	};
}
