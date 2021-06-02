import React, { Component } from "react";
import "./App.css";
import arrayMove from "array-move";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Setlist from "./components/Setlist";
import Albums from "./components/Albums";
import Staples from "./components/Staples";
import { getAlbumList, getAlbum, getArtist } from "./functions/getData";
import { pickSetlist } from "./functions/pickSetlist";
import { checkIdentical } from "./functions/checkIdentical";
import { updateDate } from "./functions/updateDate";
import { pickSong } from "./functions/pickSong";
import AlbumDistChart from "./components/AlbumDistChart";
import { makeChartData } from "./functions/makeChartData";
import AudioFeaturesChart from "./components/AudioFeaturesChart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { albumSort } from "./functions/albumSort";

const theme = createMuiTheme({
	typography: {
		fontFamily: "'Muli', sans-serif"
	}
});

const initialState = {
	albums: [],
	nodes: [],
	tracks: [],
	features: [],
	staples: [],
	defaultStaples: [],
	topTracks: [],
	setlist: [],
	setlistNodes: [],
	checked: [],
	defaultChecked: [],
	songNo: 1,
	setLoading: true,
	chartData: {},
	setlistLocked: [],
	albumsFiltered: [],
	artist: {},
	error: false
};

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	componentDidMount() {
		const param = new URLSearchParams(window.location.search).get("a");
		if (param) {
			(async () => {
				const artist = await getArtist(param);
				if (artist) {
					localStorage.setItem("artist", JSON.stringify(artist));
					this.setState({ artist }, () => this.handleData());
				}
			})();
		} else {
			// restore last used artist page on load via local storage
			const artist = localStorage.getItem("artist");
			if (artist) {
				this.setState({ artist: JSON.parse(artist) }, () => this.handleData());
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		// don't update the main component until it's done loading
		if (
			this.state.setLoading === nextState.setLoading &&
			nextState.setLoading === 0
		)
			return false;
		return true;
	}

	handleSearch = (artist) => {
		// this is for the initial artist search bar
		localStorage.setItem("artist", JSON.stringify(artist));
		this.setState({ artist }, () => this.handleData());
	};

	saveState = () => {
		const lsData = {
			albums: [...this.state.albums],
			tracks: [...this.state.tracks],
			features: [...this.state.features],
			topTracks: [...this.state.topTracks],
			staples: [...this.state.staples],
			defaultStaples: [...this.state.defaultStaples],
			songNo: this.state.songNo,
			checked: [...this.state.checked],
			setlistLocked: [...this.state.setlistLocked],
			defaultChecked: [...this.state.defaultChecked],
			setlist: [...this.state.setlist],
			setlistNodes: [...this.state.setlistNodes],
			chartData: { ...this.state.chartData },
			albumsFiltered: [...this.state.albumsFiltered]
		};
		localStorage.setItem(this.state.artist.id, JSON.stringify(lsData));
	};

	handleSetlist = () => {
		const {
			albums,
			tracks,
			features,
			checked,
			songNo,
			staples,
			setlistLocked,
			setlist
		} = this.state;

		const setlistNodes = pickSetlist(
			tracks,
			features,
			checked,
			songNo,
			staples,
			setlistLocked,
			setlist
		);

		const setlistNew = setlistNodes.map((node) => node.id);

		const chartData = makeChartData(setlistNew, albums, tracks, features);

		this.setState(
			{
				setlist: setlistNew,
				setlistNodes,
				chartData
			},
			() => this.saveState()
		);
	};

	handleSongNo = (songNo) => {
		const { checked } = this.state;

		if (Number(songNo)) {
			if (Number(songNo) > checked.length) {
				this.setState({ songNo: checked.length });
			} else {
				this.setState({ songNo: Number(songNo) });
			}
		}
	};

	sortSetlist = (oldIndex, newIndex) => {
		const { setlist, setlistNodes } = this.state;

		const setlistNew = arrayMove([...setlist], oldIndex, newIndex);

		const setlistNodesNew = [...setlistNodes].sort(
			(a, b) => setlistNew.indexOf(a.id) - setlistNew.indexOf(b.id)
		);
		setlistNodesNew.forEach(
			(track, index) => (setlistNodesNew[index].pos = index + 1)
		);

		this.setState(
			{
				setlist: setlistNew,
				setlistNodes: setlistNodesNew
			},
			() => this.saveState()
		);
	};

	handlePickSong = (id) => {
		// replace a specific song in the setlist
		const {
			albums,
			tracks,
			features,
			checked,
			setlist,
			setlistNodes,
			songNo
		} = this.state;

		const newSong = pickSong(tracks, features, checked, setlist, songNo);

		// find previous song's position and replace it
		const index = setlist.indexOf(id);
		newSong.node.pos = index + 1;
		const setlistNodesNew = [...setlistNodes];
		setlistNodesNew[index] = newSong.node;

		const setlistNew = setlistNodesNew.map((node) => node.id);

		const chartData = makeChartData(setlistNew, albums, tracks, features);

		this.setState(
			{ setlist: setlistNew, setlistNodes: setlistNodesNew, chartData },
			() => this.saveState()
		);
	};

	handleDeleteSong = (id) => {
		// remove a specific song from the setlist
		const {
			albums,
			tracks,
			features,
			setlist,
			setlistNodes,
			songNo
		} = this.state;

		const setlistNew = [...setlist].filter((track) => track !== id);
		const setlistNodesNew = [...setlistNodes].filter(
			(track) => track.id !== id
		);
		setlistNodesNew.forEach(
			(track, index) => (setlistNodesNew[index].pos = index + 1)
		);

		const chartData = makeChartData(setlistNew, albums, tracks, features);

		this.setState(
			{
				setlist: setlistNew,
				setlistNodes: setlistNodesNew,
				chartData,
				songNo: songNo - 1
			},
			() => this.saveState()
		);
	};

	handleAddSong = (start) => {
		// add a song to the setlist
		const {
			albums,
			tracks,
			features,
			checked,
			setlist,
			setlistNodes,
			songNo
		} = this.state;

		const newSong = pickSong(tracks, features, checked, setlist);

		let setlistNew;
		let setlistNodesNew;

		// if true is passed, then add song at the top of the set
		if (start) {
			setlistNew = [newSong.id, ...setlist];
			setlistNodesNew = [newSong.node, ...setlistNodes];
			setlistNodesNew.forEach(
				(track, index) => (setlistNodesNew[index].pos = index + 1)
			);
		} else {
			newSong.node.pos = setlist.length + 1;
			setlistNew = [...setlist, newSong.id];
			setlistNodesNew = [...setlistNodes, newSong.node];
		}

		const chartData = makeChartData(setlistNew, albums, tracks, features);

		this.setState(
			{
				setlist: setlistNew,
				setlistNodes: setlistNodesNew,
				chartData,
				songNo: songNo + 1
			},
			() => this.saveState()
		);
	};

	handleLockSong = (id) => {
		// lock a specific song in the setlist
		// (will not be replaced under any circumstance)
		let setlistLocked;
		if (this.state.setlistLocked.includes(id)) {
			setlistLocked = [...this.state.setlistLocked].filter((e) => e !== id);
		} else {
			setlistLocked = [...this.state.setlistLocked, id];
		}
		this.setState({ setlistLocked }, () => this.saveState());
	};

	handleUnlockAll = () => {
		this.setState({ setlistLocked: [] }, () => this.saveState());
	};

	handleReset = () => {
		// X in the header used to change artist
		this.setState({ ...initialState });
	};

	handleRefresh = () => {
		localStorage.removeItem(this.state.artist.id);
		this.setState({ setLoading: true }, () => this.handleData());
	};

	deleteAllStaples = () => {
		this.setState({ staples: [] }, () => this.saveState());
	};

	deleteStaple = (stapleId) => {
		const { staples } = this.state;

		const newState = staples.filter((e) => e !== stapleId);
		this.setState({ staples: newState }, () => this.saveState());
	};

	restoreStaples = () => {
		const { defaultStaples, checked } = this.state;

		const newStaples = [...defaultStaples];

		// have to add the staples to the song pool as well
		const newChecked = [...checked];
		newStaples.forEach((staple) => {
			if (!checked.includes(staple)) newChecked.push(staple);
		});

		this.setState({ staples: newStaples, checked: newChecked }, () =>
			this.saveState()
		);
	};

	restoreChecked = () => {
		const { topTracks } = this.state;

		const newState = [...topTracks];
		this.setState({ checked: newState }, () => this.saveState());
	};

	onCheck = (checked) => {
		// remove from staples when removed from song pool
		const { staples } = this.state;

		const newStaples = staples.filter((staple) => checked.includes(staple));
		this.setState({ checked, staples: newStaples }, () => this.saveState());
	};

	addStaple = (stapleId) => {
		const { staples, checked } = this.state;

		const newStaples = [...staples, stapleId];
		// add to pool when added as staple
		if (!checked.includes(stapleId)) {
			const newChecked = [...checked, stapleId];
			this.setState({ checked: newChecked, staples: newStaples }, () =>
				this.saveState()
			);
		} else {
			this.setState({ staples: newStaples }, () => this.saveState());
		}
	};

	onAlbumsFilteredChange = (value) => {
		// spread the state, find the appropriate object, change the checked value
		const { albumsFiltered } = this.state;

		const newAlbumsFiltered = [...albumsFiltered].map((filter) =>
			filter.value === value ? { ...filter, checked: !filter.checked } : filter
		);
		this.setState({ albumsFiltered: newAlbumsFiltered }, () =>
			this.saveState()
		);
	};

	// save in local storage as artist: {albums, tracks, etc.}
	async handleData() {
		// if the update date and artist in local storage is correct and if it hasn't been a week then load previous state
		const lsUpdateDate = localStorage.getItem("updateDate");
		if (
			localStorage.getItem(this.state.artist.id) &&
			Number(lsUpdateDate) === updateDate
		) {
			const lsData = JSON.parse(localStorage.getItem(this.state.artist.id));
			const newState = { ...this.state, ...lsData, setLoading: false };
			this.setState(newState);
		} else {
			// otherwise load albums first
			let albumList = await getAlbumList(this.state.artist.id);
			albumList = albumList.map((album) => album.id);
			let data = {};

			// chained fetch requests should really be simpler to write
			await Promise.all(
				albumList.map(async (album) => {
					data = await getAlbum(album);
				})
			).catch((err) => {
				console.error(err);
				this.setState({ error: true });
			});

			if (!data.tracks || !data.albums || !data.features) {
				// incredible error handling method
				this.setState({ error: true });
				return;
			}

			// sort by release date
			data.albums = albumSort(data.albums);

			let topTracks = data.tracks.filter(
				(track) =>
					data.albums.find((album) => album.id === track.album.id)
						.album_type === "album"
			);

			let albumsFiltered = [
				{ label: "Albums", value: "album", checked: true },
				{ label: "EPs and singles", value: "single", checked: false },
				{ label: "Deluxe editions", value: "deluxe", checked: false }
			];

			if (topTracks.length > 0) {
				topTracks =
					// if there's less than 50 tracks, use a third of the tracks
					Math.round(topTracks.length / 3) <= 49
						? topTracks
								.sort((a, b) => b.popularity - a.popularity)
								.slice(0, Math.round(topTracks.length / 3))
								.map((track) => track.id)
						: topTracks
								.sort((a, b) => b.popularity - a.popularity)
								.slice(0, 50)
								.map((track) => track.id);
			} else {
				// if there are no album tracks, use all tracks
				// the entire filter segment is janky
				albumsFiltered = [
					{ label: "Albums", value: "album", checked: true },
					{ label: "EPs and singles", value: "single", checked: true },
					{ label: "Deluxe editions", value: "deluxe", checked: true }
				];
				topTracks =
					Math.round(data.tracks.length / 3) <= 49
						? data.tracks
								.sort((a, b) => b.popularity - a.popularity)
								.slice(0, Math.round(data.tracks.length / 3))
								.map((track) => track.id)
						: data.tracks
								.sort((a, b) => b.popularity - a.popularity)
								.slice(0, 50)
								.map((track) => track.id);
			}

			const defaultStaples =
				topTracks.slice(0, topTracks.length / 4).length <= 9
					? topTracks.slice(0, topTracks.length / 4)
					: topTracks.slice(0, 10);

			const staples = defaultStaples;

			// default number of songs in generated setlist
			const songNo =
				Math.round(topTracks.length / 2) <= 24
					? Math.round(topTracks.length / 2)
					: 25;

			const checked = topTracks;

			const setlistLocked = [];

			this.setState(
				{
					albums: data.albums,
					tracks: data.tracks,
					features: data.features,
					topTracks,
					staples,
					defaultStaples,
					songNo,
					checked,
					setlistLocked,
					albumsFiltered,
					defaultChecked: topTracks
				},
				() => {
					const { albums, tracks, features } = this.state;

					const setlistNodes = pickSetlist(
						tracks,
						features,
						checked,
						songNo,
						staples
					);

					// id of arrays used to simplify some actions
					const setlist = setlistNodes.map((node) => node.id);

					// album distribution and song features charts
					const chartData = makeChartData(setlist, albums, tracks, features);

					this.setState(
						{
							setlist,
							setlistNodes,
							chartData,
							setLoading: false
						},
						() => {
							// save state in local storage
							this.saveState();
							localStorage.setItem("updateDate", updateDate);
						}
					);
				}
			);
		}
	}

	render() {
		const {
			setlist,
			setlistNodes,
			tracks,
			setLoading,
			songNo,
			checked,
			staples,
			albums,
			defaultChecked,
			defaultStaples,
			chartData,
			features,
			setlistLocked,
			albumsFiltered,
			artist,
			error
		} = this.state;

		return (
			<MuiThemeProvider theme={theme}>
				<div className="App">
					<div id="HeaderC" className="container">
						<Header
							artist={artist}
							handleSearch={this.handleSearch}
							error={error}
							setLoading={setLoading}
							handleReset={this.handleReset}
							handleRefresh={this.handleRefresh}
						/>
					</div>
					{!setLoading && artist && (
						<>
							<div id="SetlistC" className="container">
								<Setlist
									setlist={setlist}
									setlistNodes={setlistNodes}
									tracks={tracks}
									setLoading={setLoading}
									sortSetlist={this.sortSetlist}
									songNo={songNo}
									checked={checked}
									handleSongNo={this.handleSongNo}
									handleSetlist={this.handleSetlist}
									handlePickSong={this.handlePickSong}
									features={features}
									setlistLocked={setlistLocked}
									handleLockSong={this.handleLockSong}
									handleUnlockAll={this.handleUnlockAll}
									handleDeleteSong={this.handleDeleteSong}
									handleAddSong={this.handleAddSong}
								/>
							</div>
							<div id="AlbumsC" className="container">
								<Albums
									albums={albums}
									checked={checked}
									onCheck={(e) => this.onCheck(e)}
									restoreChecked={this.restoreChecked}
									checkDefaultAlbums={checkIdentical(checked, defaultChecked)}
									staples={staples}
									addStaple={this.addStaple}
									deleteStaple={this.deleteStaple}
									albumsFiltered={albumsFiltered}
									onAlbumsFilteredChange={this.onAlbumsFilteredChange}
								/>
							</div>
							<div id="StaplesC" className="container">
								<Staples
									staples={staples}
									tracks={tracks}
									songNo={songNo}
									deleteAllStaples={this.deleteAllStaples}
									deleteStaple={this.deleteStaple}
									restoreStaples={this.restoreStaples}
									checkDefaultStaples={checkIdentical(staples, defaultStaples)}
									addStaple={this.addStaple}
								/>
							</div>
							<div id="AudioFeaturesChartC" className="container">
								<AudioFeaturesChart
									chartData={chartData.audioFeaturesChartData}
								/>
							</div>
							<div id="AlbumDistChartC" className="container">
								<AlbumDistChart chartData={chartData.albumDistChartData} />
							</div>
						</>
					)}
					<div id="FooterC" className="container">
						<Footer />
					</div>
				</div>
			</MuiThemeProvider>
		);
	}
}
