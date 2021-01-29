import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import AddIcon from "@material-ui/icons/Add";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { CircleSpinner } from "react-spinners-kit";
import ClearIcon from "@material-ui/icons/Clear";
import copy from "clipboard-copy";
import Snackbar from "@material-ui/core/Snackbar";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import { getArtistsList } from "../functions/getData";

export default class Header extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			artistsFiltered: [],
			openSnackbar: false
		};
	}

	async onFilterChange() {
		// no onchange search because that would be a nightmare for the server
		const artistsFiltered = await getArtistsList(this.state.filterText);
		this.setState({ artistsFiltered });
	}

	handleSnackbarClose = () => {
		this.setState({ openSnackbar: false });
	};

	onFilterText = e => {
		this.setState({ filterText: e.target.value });
	};

	onClearClick = () => {
		this.setState({ filterText: "" });
	};

	prepareName = name => {
		// remove "the" from artist names as the header already includes it
		const preparedName = name.toLowerCase().split(" ");
		if (preparedName[0] === "the") preparedName.shift();
		return preparedName.join(" ");
	};

	copyArtist = artist => {
		// copies url directly to artist page
		copy(
			`${window.location.protocol}//${window.location.host}/?a=${artist}`
		).then(() => {
			this.setState({ openSnackbar: true });
		});
	};

	render() {
		const { filterText, artistsFiltered, openSnackbar } = this.state;
		const { artist, handleSearch, error, setLoading, handleReset } = this.props;

		return (
			<>
				{error && (
					<Typography variant="h6" className="MuiTypography-prod">
						<a href="/">something went wrong along the way</a>
					</Typography>
				)}
				{!error && !artist.id ? (
					// show search bar and list if no artist found
					<>
						<TextField
							className="MuiTextField-prod"
							type="search"
							value={filterText}
							onChange={this.onFilterText}
							onKeyPress={e => {
								if (e.key === "Enter") this.onFilterChange();
							}}
							margin="dense"
							style={{
								fontFamily: "'Muli', sans-serif",
								margin: "1vh",
								width: "11rem"
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											edge="end"
											aria-label="Search"
											size="small"
											disabled={!filterText}
											onClick={() => this.onFilterChange()}
										>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
						<div className="MuiListContainer">
							<MenuList className="MuiList-prod">
								{artistsFiltered &&
									artistsFiltered.map(artistEl => (
										<MenuItem
											key={artistEl.id}
											className="MuiListItem-prod"
											divider
											disableRipple
											onClick={() => {
												handleSearch(artistEl);
											}}
										>
											{artistEl.images[2] && (
												<ListItemAvatar className="MuiListItemAvatar-prod">
													<Avatar
														src={artistEl.images[2].url}
														className="MuiAvatar-prod"
													/>
												</ListItemAvatar>
											)}
											<ListItemText
												primary={artistEl.name}
												style={
													!artistEl.images[2] ? { paddingLeft: "2rem" } : {}
												}
												primaryTypographyProps={{
													className: "MuiTypography-prod"
												}}
												className="MuiListItemText-prod"
											/>
											<AddIcon edge="end" color="action" />
										</MenuItem>
									))}
								{artistsFiltered === false && (
									<ListItem className="MuiListItem-prod">
										<ListItemText
											primary="No artists found. Please try again."
											style={{ paddingLeft: "2rem" }}
											primaryTypographyProps={{
												className: "MuiTypography-prod"
											}}
											className="MuiListItemText-prod"
										/>
									</ListItem>
								)}
							</MenuList>
						</div>
					</>
				) : (
					// otherwise show the actual header
					<>
						<Snackbar
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							autoHideDuration={3000}
							open={openSnackbar}
							onClose={this.handleSnackbarClose}
							message={<span>Artist link copied to clipboard.</span>}
						/>
						<Typography variant="h6" className="MuiTypography-prod">
							the {this.prepareName(artist.name)}
							<IconButton
								edge="start"
								aria-label="Copy"
								size="small"
								onClick={() => {
									this.copyArtist(artist.id);
								}}
							>
								<FileCopyIcon />
							</IconButton>
							setlist generator
							<IconButton
								edge="end"
								aria-label="Clear"
								size="small"
								disableRipple
								onClick={() => handleReset()}
							>
								<ClearIcon color="action" />
							</IconButton>
						</Typography>
					</>
				)}
				{!error && setLoading && artist.id && (
					<div id="SpinnerC">
						<CircleSpinner size={48} color="#686769" />
					</div>
				)}
			</>
		);
	}
}
