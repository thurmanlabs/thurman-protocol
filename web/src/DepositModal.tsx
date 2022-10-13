import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Grid,
	Modal,
	Paper,
	TextField,
	Typography
} from "@mui/material";
import { ethers, BigNumber, Contract } from "ethers";

import { ConnectFirstModalProps } from "./DepositButton";
import USDCJson from "./constants/USDC-ABI.json";
import POOLJson from "./constants/Pool.json";

const USDC_ADDRESS_GOERLI = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
const POOL_ADDRESS_GOERLI = "0x35aE0944009Fb8f2498F75970e8c78CF6d3Aa59d";
const USDC_DECIMALS = 6;
const DECIMALS = 18;

type DepositModalProps = {
	account: string | undefined;
	open: boolean;
	setOpen: (open: boolean) => void;
	handleOpen: () => void;
	handleClose: () => void;
};

const styles = {
	modal: {
		display: "flex",
		alignItems: "center", 
		justifyContent: "center",
	},
	paper: {
    width: 450,
    padding: "1em 1em 1em 1em",
	}
}

export default function DepositModal({
	account,
	open,
	setOpen,
	handleOpen,
	handleClose,
}: DepositModalProps) {
	
	const [usdcBalance, setUsdcBalance] = useState<number | undefined>();
	const [depositValue, setDepositValue] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

	useEffect(() => {
		async function fetchUSDCBalance() {
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const usdc: Contract = new ethers.Contract(
				USDC_ADDRESS_GOERLI,
				USDCJson.abi,
				provider,
			);
			const usdcBalance = await usdc.balanceOf(account).then((num: BigNumber) => ethers.utils.formatEther(num));
			if (usdcBalance) {
				setUsdcBalance(usdcBalance * 10 ** (DECIMALS - USDC_DECIMALS));
			} else {
				setUsdcBalance(0);
			}
			
		}
		fetchUSDCBalance();
	}, [])

	useEffect(() => {
		function handleButtonAccess() {
			if ((usdcBalance && parseFloat(depositValue) > usdcBalance)) {
				setButtonDisabled(true);
			} else {
				setButtonDisabled(false);
			}
		}
		handleButtonAccess();
	}, [depositValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDepositValue(e.target.value);
	}

	// STATE AND FUNCTION TO CHECK HOW MUCH HAS BEEN APPROVED BY SIGNER TO AVOID UNECCESSARY APPROVES
	// PLUS PROMPT USER THAT THEY WILL HAVE TO APPROVE THE AMOUNT BEFORE DEPOSITING	

	const onClickDeposit = async (event: any) => {
	  event.preventDefault();
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const signer = await provider.getSigner();
	  console.log();
	  
	  const usdc: Contract = new ethers.Contract(
			USDC_ADDRESS_GOERLI,
			USDCJson.abi,
			signer,
		);
	  const allowance = await usdc.allowance(account, POOL_ADDRESS_GOERLI).then((num: BigNumber) => ethers.utils.formatEther(num));
	  console.log("allowance: ", allowance);
	  const difference = parseFloat(depositValue) - allowance;
	  console.log("difference: ", difference);

	  if (difference > 0) {
	  	const tx = await usdc.approve(POOL_ADDRESS_GOERLI, ethers.utils.parseEther(difference.toString()));
	  	tx.wait();
	  	console.log("just approved because of the difference between allowance and deposit value");
	  } else {
	  	console.log("nothing needs to be approved");
	  }

	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS_GOERLI,
	    POOLJson.abi,
	    signer
	  );
	  
	  const tx = await pool.deposit(
	    USDC_ADDRESS_GOERLI,
	    ethers.utils.parseUnits(depositValue, 6),
	  );
	  console.log(tx);
	  const tr = await tx.wait(1);
	  console.log(tr);
	  console.log(tx.hash);
	  console.log("deposited to the pool!");
	  handleClose();
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				sx={styles.modal}
			>
				<Box>
					<Paper elevation={1} sx={styles.paper}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant="h5">
									Input the amount of funds you want
								</Typography>
							</Grid>
							{(account && usdcBalance) && (
								<Grid item xs={12}>
									<Typography variant="body1">
									Current USDC Balance: {usdcBalance.toFixed(2)}
									</Typography>
								</Grid>
							)}
							<Grid item xs={12}>
							<TextField
								id="outlined-basic"
								label="USDC"
								variant="outlined"
								size="small"
								value={depositValue}
								onChange={handleChange}
							/>
							</Grid>
							<Grid item xs={12}>
								<Button variant="contained" onClick={onClickDeposit} disabled={buttonDisabled}>
									Deposit
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Box>
			</Modal>
		</div>
	);
}