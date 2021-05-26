import Chance from "chance";

const chance = new Chance();

export function pickSong(tracks, features, checked, setlist) {
	const trackList = tracks.filter(
		(trackEl) => checked.includes(track.Elid) && !setlist.includes(trackEl.id)
	);

	const trackIds = trackList.map((trackEl) => trackEl.id);
	const trackWeight = trackList.map((trackEl) => trackEl.popularity);

	const newTrack = chance.weighted(trackIds, trackWeight);

	const track = tracks.find((trackEl) => trackEl.id === newTrack);

	const feature = features.find((e) => e.id === track.id);

	return {
		id: newTrack,
		node: {
			id: track.id,
			name: track.name,
			// pos calculated in App
			duration_ms: track.duration_ms,
			album: track.album,
			key: feature.key,
			mode: feature.mode,
			tempo: feature.tempo,
			time_signature: feature.time_signature
		}
	};
}
