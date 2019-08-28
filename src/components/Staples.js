import React, { PureComponent } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/CancelOutlined";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import StaplesAppBar from "./Staples/StaplesAppBar";

export default class Staples extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filterText: "",
			tracksFiltered: []
		};
	}

	onFilterChange = e => {
		//search through tracks by name
		this.setState({ filterText: e.target.value }, () => {
			const tracksFiltered = this.props.tracks.filter(track => {
				if (
					track.name
						.toLocaleLowerCase()
						.includes(this.state.filterText.toLocaleLowerCase()) &&
					!this.props.staples.includes(track.id)
				)
					return true;
				return false;
			});

			this.setState({ tracksFiltered });
		});
	};

	onSearchClick = id => {
		this.setState({ filterText: "" });
		this.props.addStaple(id);
	};

	onClearClick = () => {
		this.setState({ filterText: "" });
	};

	render() {
		const {
			staples,
			tracks,
			songNo,
			checkDefaultStaples,
			restoreStaples,
			deleteStaple,
			deleteAllStaples
		} = this.props;

		const { filterText, tracksFiltered } = this.state;

		const data = tracks.filter(track => {
			return staples.includes(track.id);
		});

		return (
			<>
				<StaplesAppBar
					filterText={filterText}
					onFilterChange={this.onFilterChange}
					staples={staples}
					songNo={songNo}
					onClearClick={this.onClearClick}
					deleteAllStaples={deleteAllStaples}
					restoreStaples={restoreStaples}
					checkDefaultStaples={checkDefaultStaples}
				/>
				{!filterText ? (
					<List className="MuiList-prod">
						{data.map(staple => (
							<ListItem key={staple.id} className="MuiListItem-prod" divider>
								<ListItemAvatar className="MuiListItemAvatar-prod">
									<Avatar
										src={staple.album.images[2].url}
										className="MuiAvatar-prod"
									></Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={staple.name}
									className="MuiListItemText-prod"
								/>
								<ListItemSecondaryAction className="MuiIconButton-prod">
									<IconButton
										edge="end"
										aria-label="Delete"
										disableRipple
										size="small"
										onClick={() => deleteStaple(staple.id)}
									>
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				) : (
					<MenuList className="MuiList-prod">
						{tracksFiltered.slice(0, 20).map(staple => (
							<MenuItem
								key={staple.id}
								className="MuiListItem-prod"
								divider
								disableRipple
								onClick={() => {
									this.onSearchClick(staple.id);
								}}
							>
								<ListItemAvatar className="MuiListItemAvatar-prod">
									<Avatar
										src={staple.album.images[2].url}
										className="MuiAvatar-prod"
									></Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={staple.name}
									className="MuiListItemText-prod"
								/>
								<AddIcon edge="end" color="action" />
							</MenuItem>
						))}
					</MenuList>
				)}
			</>
		);
	}
}
