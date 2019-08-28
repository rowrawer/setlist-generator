import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import moment from "moment";
import LockIcon from "@material-ui/icons/Lock";
import momentDurationFormatSetup from "moment-duration-format";
import AddIcon from "@material-ui/icons/Add";

const totalDuration = (setlistNodes, tracks) => {
	momentDurationFormatSetup(moment);
	const totalTracks = tracks
		.filter(track => setlistNodes.find(e => e.id === track.id))
		.map(track => track.duration_ms)
		.reduce((a, b) => a + b);
	return moment.duration(totalTracks).format("mm:ss");
};

function SetlistAppBar(props) {
	const {
		setlistNodes,
		tracks,
		songNo,
		handleSongNo,
		checked,
		handleSetlist,
		copySetlist,
		handleMenuClick,
		setlistLocked,
		handleUnlockAll
	} = props;

	return (
		<AppBar position="static" color="default" className="MuiAppBar-prod">
			<Toolbar variant="dense" className="MuiToolbar-prod">
				<Typography variant="h6" className="MuiTypography-prod">
					Setlist
				</Typography>
				<Typography
					variant="button"
					align="right"
					className="MuiTypography-prod"
				>
					({setlistNodes.length} @ {totalDuration(setlistNodes, tracks)})
				</Typography>
				<TextField
					required
					value={songNo}
					onChange={e => handleSongNo(e.target.value)}
					type="number"
					margin="dense"
					disabled={checked.length === 0}
					style={{
						fontFamily: "'Muli', sans-serif",
						margin: "1vh",
						userSelect: "none",
						width: "3.25rem"
					}}
					className="MuiFormControl-prod"
					inputProps={{
						min: 1,
						max: checked.length
					}}
					onKeyPress={e => {
						if (e.key === "Enter") handleSetlist();
					}}
				/>
				<IconButton
					className="MuiIconButton-prod"
					edge="end"
					aria-label="Refresh all"
					size="small"
					disabled={checked.length === 0 || checked.length < songNo}
					onClick={() => handleSetlist()}
				>
					<RefreshIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="Copy"
					size="small"
					onClick={() => {
						copySetlist(setlistNodes);
					}}
				>
					<FileCopyIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="Add"
					size="small"
					disabled={checked.length <= setlistNodes.length}
					onClick={e => {
						handleMenuClick(e);
					}}
				>
					<AddIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="Unlock all"
					size="small"
					disabled={setlistLocked.length === 0}
					onClick={() => handleUnlockAll()}
				>
					<LockIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default React.memo(SetlistAppBar);
