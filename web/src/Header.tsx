import React from "react";
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
} from "@mui/material";
import ConnectButton from "./ConnectButton";

const styles = {
	appBar: {
		background: "white",
	},
	font: {
		color: "black",
	}
}

export default function Header() {
	return (
		<AppBar position="static" elevation={0} sx={styles.appBar}>
			<Toolbar variant="dense">
				<Box display="flex" flexGrow={1}>
					<Typography variant="h6" sx={styles.font}>
						Thurman
					</Typography>
				</Box>
				<ConnectButton />
			</Toolbar>
		</AppBar>
	);
}
