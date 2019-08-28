import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ResponsivePie } from "@nivo/pie";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

function AlbumDistChart(props) {
	const { chartData } = props;

	const getColors = () => {
		const colorArray = [];
		chartData.forEach(e => colorArray.push(e.color));
		return colorArray;
	};

	const chartDataSorted = [...chartData].sort((a, b) => {
		return b.value - a.value;
	});

	return (
		<>
			<AppBar position="static" color="default" className="MuiAppBar-prod">
				<Toolbar variant="dense" className="MuiToolbar-prod">
					<Typography variant="h6" className="MuiTypography-prod">
						Album distribution
					</Typography>
				</Toolbar>
			</AppBar>
			{chartData.length > 0 && (
				<>
					<div className="chartContainer">
						<ResponsivePie
							data={chartData}
							innerRadius={0.7}
							padAngle={0.7}
							cornerRadius={3}
							enableRadialLabels={false}
							colors={getColors()}
							slicesLabelsTextColor="#FFFFFF"
						/>
					</div>
					<List className="MuiList-prod">
						{chartDataSorted.map(album => {
							return (
								<ListItem
									key={album.label}
									className="MuiListItem-prod"
									divider
								>
									<ListItemAvatar className="MuiListItemAvatar-prod">
										<Avatar
											style={{ backgroundColor: album.color }}
											className="MuiAvatar-prod"
										></Avatar>
									</ListItemAvatar>
									<ListItemText
										className="MuiListItemText-prod"
										primary={`${album.label} [${album.year}]: ${album.value}`}
									/>
								</ListItem>
							);
						})}
					</List>
				</>
			)}
		</>
	);
}

export default React.memo(AlbumDistChart);
