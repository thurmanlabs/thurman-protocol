import React, { useContext } from "react";
import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import { ethers, Contract } from "ethers";
import { AccountContext } from "../context/AccountContext";
import DepositButton from "../DepositButton";
import contract from "../constants/Pool.json";
import thContract from "../constants/ThToken.json";
import weth9contract from "../constants/WETH9.json";
import headlineImg from "../images/thurmanV0HeadlineImg.png";

const POOL_ADDRESS = "0x5FDAb857C869aC4010Fe8539276932744aC2B2aB";
const TH_TOKEN_ADDRESS = "0x29dAdCC947326E9E2e9add1D0f86CF36c5b9d49D";
const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

const styles = {
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
	const { account } = useContext(AccountContext);

	const onClickDeposit = async (event: any) => {
	  event.preventDefault();
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const signer = await provider.getSigner();
	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS,
	    contract.abi,
	    signer
	  );

	  const weth: Contract = new ethers.Contract(
	    WETH_ADDRESS,
	    weth9contract,
	    signer
	  );
	  await weth.approve(pool.address, ethers.utils.parseEther("0.005"));
	  const tx = await pool.deposit(
	    WETH_ADDRESS,
	    ethers.utils.parseEther("0.001"),
	    {
	      gasPrice: 6000000,
	      gasLimit: 30000000,
	    }
	  );
	  console.log(tx);
	  const tr = await tx.wait(1);
	  console.log(tr);
	  console.log(tx.hash);
	  console.log("deposited to the pool!");
	};

	const onClickWithdraw = async (event: any) => {
	  event.preventDefault();
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const signer = await provider.getSigner();
	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS,
	    contract.abi,
	    signer
	  );

	  const tx = await pool.withdraw(
	    WETH_ADDRESS,
	    ethers.utils.parseEther("0.00025"),
	    {
	      gasPrice: 6000000,
	      gasLimit: 30000000,
	    }
	  );
	  console.log(tx);
	  const tr = await tx.wait(1);
	  console.log(tr);
	  console.log(tx.hash);
	  console.log("withdraw sucess!");
	};

	const onClickGetReserve = async () => {
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS,
	    contract.abi,
	    provider
	  );
	  const reserve: any = await pool.getReserve(WETH_ADDRESS);
	  console.log(reserve);
	};

	const onClickGetUnderlyingAsset = async () => {
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const thToken = new ethers.Contract(
	    TH_TOKEN_ADDRESS,
	    thContract.abi,
	    provider
	  );
	  const underlying: any = await thToken.getUnderlyingAsset();
	  console.log(underlying);
	};

	return (
		<Container maxWidth="lg">
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
					<Avatar variant="square" src={headlineImg} sx={{width: 673, height: 400, marginLeft: "10em"}}>Image</Avatar>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);

	// return (
	// 	<Box>
	// 		{account && <Button onClick={onClickDeposit}>Deposit</Button>}
	// 		{account && (
	// 		  <Button onClick={onClickGetReserve}>Get Reserve</Button>
	// 		)}
	// 		{account && (
	// 		  <Button onClick={onClickGetUnderlyingAsset}>Get Underlying</Button>
	// 		)}
	// 		{account && <Button onClick={onClickWithdraw}>Withdraw</Button>}
	// 	</Box>
	// );
}