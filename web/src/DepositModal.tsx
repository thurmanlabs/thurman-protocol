import React, { useState, useEffect } from "react";
import {
	Avatar,
	Box,
	Button,
	Grid,
	LinearProgress,
	Link,
	Modal,
	Paper,
	Stack,
	TextField,
	Typography
} from "@mui/material";
import { ethers, BigNumber, Contract } from "ethers";
import { 
	chainMap,
	DECIMALS, 
	USDC_DECIMALS, 
	NetworkContractMap 
} from "./constants/constants";
import usdcIcon from "./images/usdc.png";


type DepositModalProps = {
	account: string | undefined;
	chainId: string | undefined
	open: boolean;
	handleOpen: () => void;
	handleClose: () => void;
};

type txState = "uninitiated" | "inProgress" | "success" | "failed";

interface ITextFieldError {
	[error: string]: {
		text: string;
		errorMatch: boolean;
	};
}

let TextFieldErrors: ITextFieldError = {
	"NOT_VALID_NUMBER": {
		text: "The input is not a valid number.",
		errorMatch: false,
	},
	"EXCEEDS_BALANCE": {
		text: "Change your deposit value to a number below your balance",
		errorMatch: false,
	}
}

const VALID_NUMBER_REGEX = /^\d?(\.\d{0,24})?$/;

const styles = {
	modal: {
		display: "flex",
		alignItems: "center", 
		justifyContent: "center",
	},
	paper: {
    width: 450,
    padding: "1em 1em 1em 1em",
	},
	typography: {
		marginBottom: "0.15em",
	},
	usdc: {
		width: "0.75em",
    height: "0.75em",
	}
}

export default function DepositModal({
	account,
	chainId,
	open,
	handleOpen,
	handleClose,
}: DepositModalProps) {
	
	const [usdcBalance, setUsdcBalance] = useState<number | undefined>();
	const [depositValue, setDepositValue] = useState<string>("");
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [errors, setErrors] = useState<ITextFieldError>(TextFieldErrors);
	const [transactionState, setTransactionState] = useState<txState>("uninitiated");
	const [txHash, setTxHash] = useState<string | undefined>();
	const networkChainId = !chainId ? "0x1" : chainId;

	useEffect(() => {
		async function fetchUSDCBalance() { 
			const provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const usdc: Contract = new ethers.Contract(
				NetworkContractMap[networkChainId]["USDC"].address,
				NetworkContractMap[networkChainId]["USDC"].abi,
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
	}, [account, networkChainId])

	useEffect(() => {
		function handleButtonAccess() {
			if (
				((usdcBalance && parseFloat(depositValue) > usdcBalance) 
					|| !VALID_NUMBER_REGEX.test(depositValue) 
					|| depositValue === "" 
					|| depositValue === ".") 
				) {
				setButtonDisabled(true);
			} else {
				setButtonDisabled(false);
			}
		}
		handleButtonAccess();
	}, [depositValue, usdcBalance]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDepositValue(e.target.value);
		if (!VALID_NUMBER_REGEX.test(e.target.value)) {
			setErrors((TextFieldErrors) => ({
				...TextFieldErrors,
				"NOT_VALID_NUMBER": {
					...TextFieldErrors["NOT_VALID_NUMBER"],
					errorMatch: true,
				}
			}));
		} else {
			setErrors((TextFieldErrors) => ({
				...TextFieldErrors,
				"NOT_VALID_NUMBER": {
					...TextFieldErrors["NOT_VALID_NUMBER"],
					errorMatch: false,
				}
			}));
		}

		if (usdcBalance && parseFloat(e.target.value) > usdcBalance) {
			setErrors((TextFieldErrors) => ({
				...TextFieldErrors,
				"EXCEEDS_BALANCE": {
					...TextFieldErrors["EXCEEDS_BALANCE"],
					errorMatch: true,
				}
			}))
		} else {
			setErrors((TextFieldErrors) => ({
				...TextFieldErrors,
				"EXCEEDS_BALANCE": {
					...TextFieldErrors["EXCEEDS_BALANCE"],
					errorMatch: false,
				}
			}))
		}

	}

	const onClickDeposit = async (event: any) => {
	  event.preventDefault();
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const signer = await provider.getSigner();
	  
	  try {
		  setTransactionState("inProgress");
		  setButtonDisabled(true);
		  const usdc: Contract = new ethers.Contract(
				NetworkContractMap[networkChainId]["USDC"].address,
				NetworkContractMap[networkChainId]["USDC"].abi,
				signer,
			);
		  
		  const allowance = await usdc.allowance(account, NetworkContractMap[networkChainId]["POOL"].address).then((num: BigNumber) => ethers.utils.formatEther(num));
		  const difference = parseFloat(depositValue) - allowance;

		  if (difference > 0) {
		  	const tx = await usdc.approve(NetworkContractMap[networkChainId]["POOL"].address, ethers.utils.parseEther(difference.toString()));
		  	tx.wait();
		  }

		  const pool: Contract = new ethers.Contract(
		    NetworkContractMap[networkChainId]["POOL"].address,
		    NetworkContractMap[networkChainId]["POOL"].abi,
		    signer
		  );
		  
		  const tx = await pool.deposit(
		    NetworkContractMap[networkChainId]["USDC"].address,
		    ethers.utils.parseUnits(depositValue, NetworkContractMap[networkChainId]["USDC"].decimals),
		  );
		  console.log(tx);
		  await tx.wait(1);
		  setTransactionState("success");
		  setTxHash(tx.hash);
		  console.log(tx.hash);
		  setButtonDisabled(false);
		  setDepositValue("");
		  
		} catch (e) {
			console.error(e);
			setTransactionState("failed");
			setButtonDisabled(false);
		}
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
									<Stack direction="row" alignItems="center" spacing={1}>
										<Avatar src={usdcIcon} sx={styles.usdc} />
										<Typography variant="body1">
										Current USDC Balance: {usdcBalance.toFixed(2)}
										</Typography>
									</Stack>
								</Grid>
							)}
							<Grid item xs={12}>
							<Box>
							<TextField
								id="outlined-basic"
								label="USDC"
								variant="outlined"
								size="small"
								value={depositValue}
								onChange={handleChange}
							/>
							{errors["NOT_VALID_NUMBER"].errorMatch && <Typography variant="body2" sx={{color: "red"}}>{TextFieldErrors["NOT_VALID_NUMBER"].text}</Typography>}
							{errors["EXCEEDS_BALANCE"].errorMatch && <Typography variant="body2" sx={{color: "red"}}>{TextFieldErrors["EXCEEDS_BALANCE"].text}</Typography>}
							</Box>
							</Grid>
							<Grid item xs={12}>
								<Button variant="contained" onClick={onClickDeposit} disabled={buttonDisabled}>
									Deposit
								</Button>
								<Button variant="outlined" onClick={handleClose}>
									Close
								</Button>
							</Grid>
							{transactionState === "inProgress" && (
								<Grid item xs={12}>
									<Typography variant="body2" sx={styles.typography}>
										Transaction is in progress! Wait a sec. Don't close the form, yet!
									</Typography>
									<LinearProgress />
								</Grid>
								)
							}
							{transactionState === "success" && (
								<Grid item xs={12}>
									<Typography variant="body2" sx={styles.typography}>
										Transaction was successful! Go ahead and press close.
									</Typography>
									<Typography variant="body2" sx={{...styles.typography, fontWeight: "bold"}}>
										<Link
										  href={`${chainMap[networkChainId].etherscanUrl}/tx/${txHash}`}
										  target="_blank"
										>
										  Check out your transaction on Etherscan
										</Link>
									</Typography>
								</Grid>
								)
							}
							{transactionState === "failed" && (
								<Grid item xs={12}>
									<Typography variant="body2" sx={styles.typography}>
										Transaction failed! Try again.
									</Typography>
								</Grid>
								)
							}
						</Grid>
					</Paper>
				</Box>
			</Modal>
		</div>
	);
}