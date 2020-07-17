import React, { PureComponent } from "react";
import AlbumsCheckboxTree from "./Albums/AlbumsCheckboxTree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import AlbumsAppBar from "./Albums/AlbumsAppBar";
import Menu from "@material-ui/core/Menu";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default class Albums extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			nodesFiltered: this.props.albums,
			expanded: [],
			anchorEl: null
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

	//open album filter list menu
	handleMenuClick = e => this.setState({ anchorEl: e.currentTarget });

	handleMenuClose = () => this.setState({ anchorEl: null });

	render() {
		const {
			checked,
			onCheck,
			restoreChecked,
			checkDefaultAlbums,
			staples,
			addStaple,
			deleteStaple,
			albumsFiltered,
			onAlbumsFilteredChange
		} = this.props;
		const { filterText, nodesFiltered, expanded, anchorEl } = this.state;

		return (
			<>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleMenuClose}
				>
					<FormGroup>
						{albumsFiltered &&
							albumsFiltered.map(filter => {
								return (
									//only show a filter when needed
									nodesFiltered.filter(
										album => album.album_type === filter.value
									).length > 0 && (
										<MenuItem key={filter.value} dense>
											<FormControlLabel
												control={
													<Checkbox
														checked={filter.checked}
														value={filter.value}
														color="default"
														disableRipple
														style={{ backgroundColor: "transparent" }}
													/>
												}
												label={filter.label}
												onChange={() => onAlbumsFilteredChange(filter.value)}
											/>
										</MenuItem>
									)
								);
							})}
					</FormGroup>
				</Menu>
				<AlbumsAppBar
					filterText={filterText}
					onFilterChange={this.onFilterChange}
					onClearClick={this.onClearClick}
					checked={checked}
					restoreChecked={restoreChecked}
					checkDefaultAlbums={checkDefaultAlbums}
					handleMenuClick={this.handleMenuClick}
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
					albumsFiltered={albumsFiltered}
				/>
			</>
		);
	}
}
