import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import LockOpenIcon from "@material-ui/icons/LockOpenOutlined";
import LockIcon from "@material-ui/icons/Lock";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/CancelOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import { SortableHandle, SortableElement } from "react-sortable-hoc";

const keyNotation = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];

const TrackDetails = ({ track }) => {
	return (
		<>
			Position: {track.pos}
			<br />
			Duration: {moment(track.duration_ms).format("m:ss")}
			<br />
			Album: {track.album.name} [{track.album.release_date.substring(0, 4)}]
			<br />
			Key: {keyNotation[track.key]}
			{track.mode === 0 ? "m" : ""}
			<br />
			Tempo: {Math.round(track.tempo)} BPM
			<br />
			Time signature: {track.time_signature}/4
		</>
	);
};

function SetlistListItem(props) {
	const {
		track,
		setlistLength,
		setlistLocked,
		checkedLength,
		songNo,
		handlePickSong,
		handleLockSong,
		handleDeleteSong,
		index,
		expanded,
		handleExpand
	} = props;

	const DragHandle = SortableHandle(() => (
		<DragHandleIcon className="MuiSvgIcon-prod" />
	));

	const SortableItem = SortableElement(() => {
		return (
			<ListItem
				className="MuiListItem-prod"
				style={setlistLocked ? { backgroundColor: "#f5f5f5" } : {}}
				divider
			>
				<ListItemIcon className="MuiListItemIcon-prod" size="small">
					{!expanded ? (
						<DragHandle />
					) : (
						<Avatar
							src={track.album.images[2].url}
							className="MuiAvatar-prod"
						/>
					)}
				</ListItemIcon>
				<ListItemText
					primaryTypographyProps={{
						className: expanded
							? "MuiTypography-prod expanded"
							: "MuiTypography-prod"
					}}
					primary={`${track.name}`}
					secondary={expanded ? <TrackDetails track={track} /> : ""}
				/>
				<ListItemSecondaryAction className="MuiListItemSecondaryAction-prod">
					<IconButton
						edge="end"
						aria-label="Refresh"
						size="small"
						style={!expanded ? { display: "none" } : {}}
						disabled={
							checkedLength === 0 || checkedLength <= songNo || setlistLocked
						}
						onClick={() => handlePickSong(track.id)}
					>
						<RefreshIcon />
					</IconButton>
					<IconButton
						edge="end"
						aria-label="Delete"
						size="small"
						style={!expanded ? { display: "none" } : {}}
						disabled={setlistLocked || setlistLength <= 1}
						onClick={() => handleDeleteSong(track.id)}
					>
						<DeleteIcon />
					</IconButton>
					<IconButton
						edge="end"
						aria-label={!setlistLocked ? "Lock" : "Unlock"}
						size="small"
						style={!expanded ? { display: "none" } : {}}
						onClick={() => handleLockSong(track.id)}
					>
						{!setlistLocked ? <LockOpenIcon /> : <LockIcon />}
					</IconButton>
					<IconButton
						edge="end"
						aria-label={!expanded ? "Expand more" : "Expand less"}
						size="small"
						onClick={() => handleExpand(track.id)}
					>
						{!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		);
	});

	return <SortableItem index={index} />;
}

export default React.memo(SetlistListItem);
