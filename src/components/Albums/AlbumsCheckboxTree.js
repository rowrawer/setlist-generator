import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpenOutlined";
import LockIcon from "@material-ui/icons/Lock";
import Divider from "@material-ui/core/Divider";

const AlbumEntry = ({
	album,
	checked,
	handleCheckAlbum,
	handleExpand,
	expanded
}) => {
	const checkBoxState = album.tracks.items.filter((track) =>
		// establish amount of checked tracks
		// (determines state of album checkbox)
		checked.includes(track.id)
	);

	return (
		album.tracks.items.length > 0 && (
			<ListItem className="MuiListItem-prod">
				<ListItemIcon edge="start" className="MuiListItemIcon-prod">
					<IconButton
						size="small"
						onClick={() => handleExpand(album.id)}
						className="MuiIconButton-prod"
					>
						{!expanded.includes(album.id) ? (
							<ExpandMoreIcon />
						) : (
							<ExpandLessIcon />
						)}
					</IconButton>
				</ListItemIcon>
				<ListItemIcon edge="start" className="MuiListItemIcon-prod">
					<Checkbox
						style={{ padding: "0.25rem" }}
						size="small"
						onClick={() =>
							handleCheckAlbum(album.tracks.items.map((track) => track.id))
						}
						color="default"
						checked={checkBoxState.length === album.tracks.items.length}
						indeterminate={
							checkBoxState.length < album.tracks.items.length &&
							checkBoxState.length > 0
						}
					/>
				</ListItemIcon>
				<ListItemAvatar className="MuiListItemAvatar-prod">
					<Avatar src={album.images[2].url} className="MuiAvatar-prod" />
				</ListItemAvatar>
				<ListItemText
					primary={`${album.name} [${album.release_date.substring(0, 4)}]`}
					className="MuiListItemText-prod"
				/>
			</ListItem>
		)
	);
};

const TrackEntries = ({
	tracks,
	album,
	expanded,
	checked,
	handleCheck,
	staples,
	addStaple,
	deleteStaple
}) =>
	tracks.map(
		(track) =>
			expanded.includes(album) && (
				<ListItem
					key={track.id}
					className="MuiListItem-prod track"
					style={
						staples.includes(track.id) ? { backgroundColor: "#f5f5f5" } : {}
					}
				>
					<ListItemIcon edge="start" className="MuiListItemIcon-prod">
						<Checkbox
							style={{ padding: "0.25rem" }}
							size="small"
							onClick={() => handleCheck(track.id)}
							checked={checked.includes(track.id)}
							color="default"
						/>
					</ListItemIcon>
					<ListItemIcon edge="start" className="MuiListItemIcon-prod">
						{!staples.includes(track.id) ? (
							<IconButton size="small" onClick={() => addStaple(track.id)}>
								<LockOpenIcon />
							</IconButton>
						) : (
							<IconButton size="small" onClick={() => deleteStaple(track.id)}>
								<LockIcon />
							</IconButton>
						)}
					</ListItemIcon>
					<ListItemText
						primary={`${track.track_number}. ${track.name} (${moment(
							track.duration_ms
						).format("m:ss")})`}
						className="MuiListItemText-prod"
					/>
				</ListItem>
			)
	);

function AlbumsCheckboxTree(props) {
	const {
		nodes,
		checked,
		expanded,
		onCheck,
		onExpand,
		staples,
		addStaple,
		deleteStaple,
		albumsFiltered
	} = props;

	const handleExpand = (id) => {
		var newExpanded;
		if (expanded.includes(id)) {
			newExpanded = [...expanded].filter((e) => e !== id);
		} else {
			newExpanded = [...expanded, id];
		}
		onExpand(newExpanded);
	};

	const handleCheck = (id) => {
		var newChecked;

		if (checked.includes(id)) {
			newChecked = [...checked].filter((e) => e !== id);
		} else {
			newChecked = [...checked, id];
		}
		onCheck(newChecked);
	};

	const handleCheckAlbum = (id) => {
		var newChecked = [...checked];

		// check or uncheck all tracks belonging to album
		if (checked.filter((track) => id.includes(track)).length === id.length) {
			newChecked = checked.filter((track) => !id.includes(track));
		} else {
			newChecked = checked.concat(
				id.filter((track) => !checked.includes(track))
			);
		}
		onCheck(newChecked);
	};

	return (
		<List className="MuiList-prod">
			{nodes.map(
				(album, i) =>
					// only display if not filtered out or already in pool
					(albumsFiltered.find((filter) => filter.value === album.album_type)
						.checked ||
						album.tracks.items.filter((track) => checked.includes(track.id))
							.length > 0) && (
						// add divider if different type than previous element in array
						<React.Fragment key={album.id}>
							{nodes[i - 1] && nodes[i - 1].album_type !== album.album_type && (
								<Divider />
							)}
							<AlbumEntry
								album={album}
								checked={checked}
								handleCheckAlbum={handleCheckAlbum}
								handleExpand={handleExpand}
								expanded={expanded}
							/>
							<TrackEntries
								tracks={album.tracks.items}
								checked={checked}
								handleCheck={handleCheck}
								expanded={expanded}
								album={album.id}
								staples={staples}
								addStaple={addStaple}
								deleteStaple={deleteStaple}
							/>
						</React.Fragment>
					)
			)}
		</List>
	);
}

export default React.memo(AlbumsCheckboxTree);
