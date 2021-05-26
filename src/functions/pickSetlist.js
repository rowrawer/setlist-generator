import Chance from "chance";

const chance = new Chance();

export function pickSetlist(
	tracks,
	features,
	checked,
	songNo,
	staples,
	setlistLocked = [],
	oldSetlist = []
) {
	const trackList = tracks.filter(
		(track) =>
			// only use suitable tracks
			checked.includes(track.id) &&
			!staples.includes(track.id) &&
			!setlistLocked.includes(track.id)
	);

	let setlist = [];

	if (staples.length > 0) {
		// ensure that staples are included in the set
		const shuffledStaples = chance.shuffle(staples);
		shuffledStaples.forEach((staple, index) => {
			if (index < songNo) {
				if (oldSetlist.length > 0 && setlistLocked.length > 0) {
					// take into account the amount of locked songs
					if (!oldSetlist.includes(staple) && index <= setlistLocked.length)
						setlist.push(staple);
				} else {
					setlist.push(staple);
				}
			}
		});
	}

	const songNoArrayNo = songNo - setlistLocked.length - setlist.length;

	if (songNoArrayNo > 0) {
		// if the entire setlist wasn't populated by staples
		const trackIds = trackList.map((track) => track.id);
		const trackWeight = trackList.map((track) => track.popularity || 1);

		// "do forEach this amount of times"
		const songNoArray = [...Array(songNoArrayNo)];
		songNoArray.forEach(() => {
			const pick = chance.weighted(trackIds, trackWeight);
			setlist.push(pick);
			trackIds.splice(trackIds.indexOf(pick), 1);
			trackWeight.splice(trackIds.indexOf(pick), 1);
		});
	}
	setlist = chance.shuffle(setlist);

	// add locked songs back where they were
	setlistLocked.forEach((e) => {
		setlist.splice(oldSetlist.indexOf(e), 0, e);
	});

	const setlistNodes = tracks
		.filter((track) => setlist.includes(track.id))
		.sort((a, b) => setlist.indexOf(a.id) - setlist.indexOf(b.id))
		.map((track) => {
			const feature = features.find((e) => e.id === track.id);
			return {
				id: track.id,
				name: track.name,
				pos: setlist.indexOf(track.id) + 1,
				duration_ms: track.duration_ms,
				album: track.album,
				key: feature.key,
				mode: feature.mode,
				tempo: feature.tempo,
				time_signature: feature.time_signature
			};
		});

	return setlistNodes;
}
