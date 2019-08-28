import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/CancelOutlined";

function StaplesAppBar(props) {
	const {
		filterText,
		onFilterChange,
		staples,
		songNo,
		onClearClick,
		deleteAllStaples,
		restoreStaples,
		checkDefaultStaples
	} = props;

	return (
		<AppBar position="static" color="default" className="MuiAppBar-prod">
			<Toolbar variant="dense" className="MuiToolbar-prod">
				<Typography variant="h6" className="MuiTypography-prod">
					Set staples
				</Typography>
				<TextField
					type="search"
					value={filterText}
					onChange={onFilterChange}
					margin="dense"
					disabled={staples.length >= songNo}
					style={{
						fontFamily: "'Muli', sans-serif",
						margin: "1vh",
						width: "11rem"
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon color="disabled" />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									edge="end"
									aria-label="Clear"
									size="small"
									disableRipple
									disabled={!filterText}
									onClick={onClearClick}
								>
									{filterText && <ClearIcon color="action" />}
								</IconButton>
							</InputAdornment>
						)
					}}
				/>
				<Typography
					align="right"
					variant="button"
					className="MuiTypography-prod"
				>
					{staples.length}
				</Typography>
				<IconButton
					edge="end"
					aria-label="Delete all"
					size="small"
					onClick={() => deleteAllStaples()}
					disabled={staples.length === 0}
				>
					<DeleteIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="Restore defaults"
					size="small"
					onClick={() => restoreStaples()}
					disabled={checkDefaultStaples}
				>
					<SettingsBackupRestoreIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default React.memo(StaplesAppBar);
