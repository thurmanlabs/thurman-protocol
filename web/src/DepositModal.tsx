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

const USDC_ADDRESS_TESTNET = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
const USDC_DECIMALS = 6;
const DECIMALS = 18;

type DepositModalProps = {
	account: string | undefined;
	open: boolean;
	setOpen: (open: boolean) => void;
	handleOpen: () => void;
	handleClose: () => void;
};

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
				USDC_ADDRESS_TESTNET,
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

	const onClickDeposit = async () => {
		console.log("Clicked Deposit Button");
	}
	// const onClickDeposit = async (event: any) => {
	//   event.preventDefault();
	//   const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	//   const signer = await provider.getSigner();
	//   const pool: Contract = new ethers.Contract(
	//     POOL_ADDRESS,
	//     contract.abi,
	//     signer
	//   );

	//   const weth: Contract = new ethers.Contract(
	//     WETH_ADDRESS,
	//     weth9contract,
	//     signer
	//   );
	//   await weth.approve(pool.address, ethers.utils.parseEther("0.005"));
	//   const tx = await pool.deposit(
	//     WETH_ADDRESS,
	//     ethers.utils.parseEther("0.001"),
	//     {
	//       gasPrice: 6000000,
	//       gasLimit: 30000000,
	//     }
	//   );
	//   console.log(tx);
	//   const tr = await tx.wait(1);
	//   console.log(tr);
	//   console.log(tx.hash);
	//   console.log("deposited to the pool!");
	// };

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
			>
				<Box>
					<Paper elevation={1} sx={{width: 400}}>
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
								label="Outlined"
								variant="outlined"
								value={depositValue}
								onChange={handleChange}
							/>
							</Grid>
							<Grid item xs={12}>
								<Button onClick={onClickDeposit} disabled={buttonDisabled}>
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