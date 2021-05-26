import moment from "moment";
import red from "@material-ui/core/colors/red";
import purple from "@material-ui/core/colors/purple";
import indigo from "@material-ui/core/colors/indigo";
import cyan from "@material-ui/core/colors/cyan";
import teal from "@material-ui/core/colors/teal";
import lightGreen from "@material-ui/core/colors/lightGreen";
import lime from "@material-ui/core/colors/lime";
import yellow from "@material-ui/core/colors/yellow";
import orange from "@material-ui/core/colors/orange";
import brown from "@material-ui/core/colors/brown";
import blueGrey from "@material-ui/core/colors/blueGrey";
import Chance from "chance";
import { albumSort } from "./albumSort";

const chance = new Chance();

let colorsProcessed = [];

const colors = [
	red,
	purple,
	indigo,
	cyan,
	teal,
	lightGreen,
	lime,
	yellow,
	orange,
	brown,
	blueGrey
];

colors.forEach((hue) => {
	let shade = 100;
	colorsProcessed.push(hue[shade]);

	[...Array(4)].forEach(() => {
		shade += 200;
		colorsProcessed.push(hue[shade]);
	});
});

colorsProcessed = chance.shuffle(colorsProcessed);

export const makeChartData = (setlist, albums, tracks, features) => {
	let albumDistChartData = albumSort(albums).map((album, index) => {
		const newTracks = album.tracks.items.filter((track) =>
			setlist.includes(track.id)
		);

		return {
			id: `${album.name} (${album.release_date.slice(0, 4)})`,
			label: `${album.name} (${album.release_date.slice(0, 4)})`,
			value: newTracks.length,
			year: album.release_date.substring(0, 4),
			color: colorsProcessed[index]
		};
	});

	albumDistChartData = albumDistChartData.filter((album) => album.value > 0);

	const audioFeaturesChartData = {
		duration_ms: { name: "Duration", min: 0, avg: 0, max: 0 },
		tempo: { name: "Tempo (BPM)", min: 0, avg: 0, max: 0 },
		release_date: { name: "Release year", min: 0, avg: 0, max: 0 }
	};

	const setlistTracks = tracks.filter((track) => setlist.includes(track.id));
	const setlistFeatures = features.filter((track) =>
		setlist.includes(track.id)
	);

	setlistFeatures.map((track) => track.duration_ms).sort((a, b) => b - a);

	const sortedDuration = setlistFeatures
		.map((track) => track.duration_ms)
		.sort((a, b) => b - a);

	audioFeaturesChartData.duration_ms.min = moment(
		Math.round(sortedDuration[sortedDuration.length - 1])
	).format("m:ss");

	audioFeaturesChartData.duration_ms.max = moment(
		Math.round(sortedDuration[0])
	).format("m:ss");

	audioFeaturesChartData.duration_ms.avg = moment(
		Math.round(sortedDuration.reduce((a, b) => a + b) / sortedDuration.length)
	).format("m:ss");

	const sortedTempo = setlistFeatures
		.map((track) => track.tempo)
		.sort((a, b) => b - a);

	audioFeaturesChartData.tempo.min = Math.round(
		sortedTempo[sortedTempo.length - 1]
	);

	audioFeaturesChartData.tempo.max = Math.round(sortedTempo[0]);

	audioFeaturesChartData.tempo.avg = Math.round(
		sortedTempo.reduce((a, b) => a + b) / sortedTempo.length
	);

	const sortedYear = setlistTracks
		.map((track) => Number(track.album.release_date.slice(0, 4)))
		.sort((a, b) => b - a);

	audioFeaturesChartData.release_date.min = sortedYear[sortedYear.length - 1];

	[audioFeaturesChartData.release_date.max] = sortedYear;

	audioFeaturesChartData.release_date.avg = Math.round(
		sortedYear.reduce((a, b) => a + b) / sortedYear.length
	);

	return { albumDistChartData, audioFeaturesChartData };
};
