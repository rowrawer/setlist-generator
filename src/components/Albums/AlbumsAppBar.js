import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import FilterListIcon from "@material-ui/icons/FilterList";

function AlbumsAppBar(props) {
	const {
		filterText,
		onFilterChange,
		onClearClick,
		checked,
		restoreChecked,
		checkDefaultAlbums,
		handleMenuClick
	} = props;

	return (
		<AppBar position="static" color="default" className="MuiAppBar-prod">
			<Toolbar variant="dense" className="MuiToolbar-prod">
				<Typography variant="h6" className="MuiTypography-prod">
					Song pool
				</Typography>
				<TextField
					type="search"
					value={filterText}
					onChange={onFilterChange}
					margin="dense"
					style={{
						fontFamily: "'Muli', sans-serif",
						margin: "1vh",
						width: "12rem"
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
									onClick={() => onClearClick()}
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
					{checked.length}
				</Typography>
				<IconButton
					edge="end"
					aria-label="Filter"
					size="small"
					onClick={e => {
						handleMenuClick(e);
					}}
				>
					<FilterListIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="Restore defaults"
					size="small"
					onClick={() => restoreChecked()}
					disabled={checkDefaultAlbums}
				>
					<SettingsBackupRestoreIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default React.memo(AlbumsAppBar);
