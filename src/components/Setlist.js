import React, { PureComponent } from "react";
import copy from "clipboard-copy";
import Snackbar from "@material-ui/core/Snackbar";
import { SortableContainer } from "react-sortable-hoc";
import List from "@material-ui/core/List";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import VerticalAlignBottomIcon from "@material-ui/icons/VerticalAlignBottom";
import SetlistAppBar from "./Setlist/SetlistAppBar";
import SetlistListItem from "./Setlist/SetlistListItem";

export default class Setlist extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			openSnackbar: false,
			expanded: [],
			anchorEl: null
		};
	}

	handleExpand = (id) => {
		// add or delete from list of expanded entries
		var expanded;
		if (this.state.expanded.includes(id)) {
			expanded = [...this.state.expanded].filter((e) => e !== id);
		} else {
			expanded = [...this.state.expanded, id];
		}
		this.setState({ expanded });
	};

	onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) this.props.sortSetlist(oldIndex, newIndex);
	};

	copySetlist = (setlistNodes) => {
		// copies setlist as a plain text list
		const formattedSetlist = [];
		setlistNodes.forEach((track) => {
			formattedSetlist.push(`${track.pos}. ${track.name}`);
		});
		copy(formattedSetlist.join("\n")).then(() => {
			this.setState({ openSnackbar: true });
		});
	};

	handleSnackbarClose = () => {
		this.setState({ openSnackbar: false });
	};

	// open add song menu
	handleMenuClick = (e) => this.setState({ anchorEl: e.currentTarget });

	handleMenuClose = () => this.setState({ anchorEl: null });

	render() {
		const {
			setlistNodes,
			setLoading,
			tracks,
			songNo,
			checked,
			handleSetlist,
			handleSongNo,
			handlePickSong,
			setlistLocked,
			handleLockSong,
			handleUnlockAll,
			handleDeleteSong,
			handleAddSong
		} = this.props;

		const { openSnackbar, expanded, anchorEl } = this.state;

		const SortableList = SortableContainer(() => (
			<List className="MuiList-prod">
				{setlistNodes.map((track, index) => (
					<SetlistListItem
						index={index}
						key={track.id}
						track={track}
						setlistLength={setlistNodes.length}
						setlistLocked={setlistLocked.includes(track.id)}
						expanded={expanded.includes(track.id)}
						checkedLength={checked.length}
						songNo={songNo}
						handlePickSong={handlePickSong}
						handleLockSong={handleLockSong}
						handleDeleteSong={handleDeleteSong}
						handleExpand={this.handleExpand}
					/>
				))}
			</List>
		));

		return (
			!setLoading && (
				<>
					<Snackbar
						anchorOrigin={{ vertical: "top", horizontal: "left" }}
						autoHideDuration={3000}
						open={openSnackbar}
						onClose={this.handleSnackbarClose}
						message={<span>Setlist copied to clipboard.</span>}
					/>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={this.handleMenuClose}
					>
						<MenuItem
							dense
							divider
							onClick={() => {
								handleAddSong(true);
								this.handleMenuClose();
							}}
						>
							<VerticalAlignTopIcon color="action" />
						</MenuItem>
						<MenuItem
							dense
							onClick={() => {
								handleAddSong();
								this.handleMenuClose();
							}}
						>
							<VerticalAlignBottomIcon color="action" />
						</MenuItem>
					</Menu>
					<SetlistAppBar
						setlistNodes={setlistNodes}
						tracks={tracks}
						songNo={songNo}
						handleSongNo={handleSongNo}
						checked={checked}
						handleSetlist={handleSetlist}
						copySetlist={this.copySetlist}
						handleMenuClick={this.handleMenuClick}
						setlistLocked={setlistLocked}
						handleUnlockAll={handleUnlockAll}
					/>
					{setlistNodes.length > 0 && (
						<SortableList onSortEnd={this.onSortEnd} useDragHandle />
					)}
				</>
			)
		);
	}
}
