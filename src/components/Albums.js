import React, { PureComponent } from "react";
import AlbumsCheckboxTree from "./Albums/AlbumsCheckboxTree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import AlbumsAppBar from "./Albums/AlbumsAppBar";

export default class Albums extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			nodesFiltered: this.props.albums,
			expanded: []
		};
	}

	onFilterChange = e => {
		this.setState({ filterText: e.target.value }, () => {
			let nodesFiltered = this.props.albums;
			if (this.state.filterText.length > 0) {
				nodesFiltered = nodesFiltered.map(album => {
					//go through albums and filter through tracks by name
					const newTracks = album.tracks.items.filter(track =>
						track.name
							.toLocaleLowerCase()
							.includes(this.state.filterText.toLocaleLowerCase())
					);
					//not very elegant but at least it works
					return { ...album, tracks: { items: newTracks } };
				});
			}
			this.setState({ nodesFiltered });
		});
	};

	onClearClick = () => {
		this.setState({ filterText: "", nodesFiltered: this.props.albums });
	};

	onExpand = expanded => this.setState({ expanded });

	render() {
		const {
			checked,
			onCheck,
			restoreChecked,
			checkDefaultAlbums,
			staples,
			addStaple,
			deleteStaple
		} = this.props;
		const { filterText, nodesFiltered, expanded } = this.state;

		return (
			<>
				<AlbumsAppBar
					filterText={filterText}
					onFilterChange={this.onFilterChange}
					onClearClick={this.onClearClick}
					checked={checked}
					restoreChecked={restoreChecked}
					checkDefaultAlbums={checkDefaultAlbums}
				/>
				<AlbumsCheckboxTree
					nodes={nodesFiltered}
					onCheck={onCheck}
					checked={checked}
					expanded={expanded}
					onExpand={this.onExpand}
					staples={staples}
					addStaple={addStaple}
					deleteStaple={deleteStaple}
				/>
			</>
		);
	}
}
