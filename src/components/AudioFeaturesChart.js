import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

function AudioFeaturesChart(props) {
	const { chartData } = props;
	return (
		<>
			<AppBar position="static" color="default" className="MuiAppBar-prod">
				<Toolbar variant="dense" className="MuiToolbar-prod">
					<Typography variant="h6" className="MuiTypography-prod">
						Song features
					</Typography>
				</Toolbar>
			</AppBar>

			<Table className="MuiTable-prod" size="small">
				<TableHead className="MuiTableHead-prod">
					<TableRow>
						<TableCell className="MuiTableCell-prod">Feature</TableCell>
						<TableCell className="MuiTableCell-prod" align="right">
							Minimum
						</TableCell>
						<TableCell className="MuiTableCell-prod" align="right">
							Average
						</TableCell>
						<TableCell className="MuiTableCell-prod" align="right">
							Maximum
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className="MuiTableBody-prod">
					{Object.keys(chartData).map((row) => (
						<TableRow key={chartData[row].name}>
							<TableCell
								className="MuiTableCell-prod"
								component="th"
								scope="row"
							>
								{chartData[row].name}
							</TableCell>
							<TableCell className="MuiTableCell-prod" align="right">
								{chartData[row].min}
							</TableCell>
							<TableCell className="MuiTableCell-prod" align="right">
								{chartData[row].avg}
							</TableCell>
							<TableCell className="MuiTableCell-prod" align="right">
								{chartData[row].max}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}

export default React.memo(AudioFeaturesChart);
