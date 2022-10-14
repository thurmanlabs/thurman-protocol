import React from "react";
import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import DepositButton from "../DepositButton";
import headlineImg from "../images/thurmanV0HeadlineImg.png";

const styles = {
	container: {
		marginTop: "3em",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontWeight: "bolder",
	},
	subscribeButton: {
		borderColor: "black",
		color: "black",
		"&:hover": {
			backgroundColor: "#525252",
			color: "white",
			border: "none",
		}
	}
};

export default function Home() {

	return (
		<Container maxWidth="lg" sx={styles.container}>
			<Grid container spacing={5}>
				<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
					<Typography variant="h2" align="left" sx={styles.title}>
						Secured lines of credit for businesses
					</Typography>
					<Typography variant="h4" align="left">
						A lending protocol that matches funders with businesses in the missing middle
					</Typography>
					<Box 
						display="flex"
						justifyContent="flex-start"
						alignItems="flex-start"
					>
						<DepositButton />
						<Button variant="outlined" sx={styles.subscribeButton}>
							Subscribe
						</Button>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
					<Avatar variant="square" src={headlineImg} sx={{width: 673, height: 400, marginLeft: "10em"}} />
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}