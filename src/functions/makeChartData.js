import { albumSort } from "./albumSort";
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

colors.forEach(hue => {
	let shade = 100;
	colorsProcessed.push(hue[shade]);

	[...Array(4)].forEach(i => {
		shade += 200;
		colorsProcessed.push(hue[shade]);
	});
});

colorsProcessed = chance.shuffle(colorsProcessed);

export const makeChartData = (setlist, albums, features) => {
	let albumDistChartData = albumSort(albums).map((album, index) => {
		const newTracks = album.tracks.items.filter(track =>
			setlist.includes(track.id)
		);

		return {
			id: album.name,
			label: album.name,
			value: newTracks.length,
			year: album.release_date.substring(0, 4),
			color: colorsProcessed[index]
		};
	});

	albumDistChartData = albumDistChartData.filter(album => album.value > 0);

	let audioFeaturesChartData = {
		duration_ms: { name: "Duration", min: 0, avg: 0, max: 0 },
		tempo: { name: "Tempo (BPM)", min: 0, avg: 0, max: 0 }
	};

	const setlistTracks = features.filter(track => setlist.includes(track.id));

	setlistTracks.map(track => track.duration_ms).sort((a, b) => b - a);

	for (let feature in audioFeaturesChartData) {
		const sortedTracks = setlistTracks
			.map(track => track[feature])
			.sort((a, b) => b - a);
		audioFeaturesChartData[feature].min = Math.round(
			sortedTracks[sortedTracks.length - 1]
		);
		audioFeaturesChartData[feature].max = Math.round(sortedTracks[0]);
		audioFeaturesChartData[feature].avg = Math.round(
			sortedTracks.reduce((a, b) => {
				if (Number(a) && Number(b)) return a + b;
				return 0;
			}) / sortedTracks.length
		);
	}

	for (let value in audioFeaturesChartData.duration_ms) {
		if (Number(audioFeaturesChartData.duration_ms[value]))
			audioFeaturesChartData.duration_ms[value] = moment(
				audioFeaturesChartData.duration_ms[value]
			).format("m:ss");
	}

	return { albumDistChartData, audioFeaturesChartData };
};
