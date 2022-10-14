import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Button,
	Divider,
	Modal,
	Paper,
	Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { AccountContext } from "./context/AccountContext";
import DepositModal from "./DepositModal";

export type ConnectFirstModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	openDeposit: boolean;
	setOpenDeposit: (open: boolean) => void;
	handleOpen: () => void;
	handleClose: () => void;
	handleOpenDeposit: () => void;
	handleCloseDeposit: () => void;
	account: string | undefined;
	chainId: string | undefined;
	onUpdateAccount: (account: string) => void;
};

const styles = {
	connectFirstPaper: {
		width: 450,
		padding: "1em 1em 1em 1em",
	},
	depositButton: {
		backgroundColor: "black",
		"&:hover": {
			backgroundColor: "#525252",
		},
	},
	connectFirstButton: {
		backgroundColor: "#171717",
		"&:hover": {
			backgroundColor: "#525252",
		},
	},
	typography: {
		margin: "0.75em 0em 0.25em 0em",
	},
};

function ConnectFirstModal({
	open,
	setOpen,
	handleOpen,
	handleClose,
	openDeposit,
	setOpenDeposit,
	handleOpenDeposit,
	handleCloseDeposit,
	account,
	chainId,
	onUpdateAccount,
}: ConnectFirstModalProps) {

	const onClickConnect = async (
	  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
	  if (!window.ethereum) {
	    alert("You need to install MetaMask to connect a wallet");
	    window.open("https://metamask.io/", "_blank");
	    return;
	  }

	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  await provider
	    .send("eth_requestAccounts", [])
	    .then((accounts) => {
	      if (accounts.length > 0) {
	        onUpdateAccount(accounts[0]);
	        handleClose();
	      }
	    })
	    .catch((e) => console.log(e));
	};

	return (
		<div>
			<Button
				variant="contained"
				sx={styles.depositButton}
				onClick={handleOpen}
			>
				Deposit
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
			>
				<Box>
					<Paper elevation={1} sx={styles.connectFirstPaper}>
						<Typography variant="h6" sx={{...styles.typography, fontWeight: "bold"}}>
							You need to connect to MetaMask before you can deposit funds!
						</Typography>
						<Divider />
						<Typography variant="body2" sx={styles.typography}>
							If don't have the MetaMask Browser Extension, you'll be redirected to their website. Once you install the extension and add an account, you'll be able to connect to our app!
						</Typography>
						<Button variant="contained" sx={styles.connectFirstButton} onClick={onClickConnect}>
							Connect
						</Button>
					</Paper>
				</Box>
			</Modal>
			<Box>
			{openDeposit && <DepositModal
				account={account}
				chainId={chainId}
				open={openDeposit}
				setOpen={setOpenDeposit}
				handleOpen={handleOpenDeposit}
				handleClose={handleCloseDeposit}
			/>}
			</Box>
		</div>
	);
}

export default function DepositButton() {
	const [open, setOpen] = useState<boolean>(false);
	const [openDeposit, setOpenDeposit] = useState<boolean>(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleOpenDeposit = () => setOpenDeposit(true);
	const handleCloseDeposit = () => setOpenDeposit(false);

	const { account, chainId, onUpdateAccount } = useContext(AccountContext);

	return (
		<Box>
			{ account && chainId ? (
				<div>
					<Button
						variant="contained"
						sx={styles.depositButton}
						onClick={handleOpenDeposit}
					>
						Deposit
					</Button>
					<DepositModal
						account={account}
						chainId={chainId}
						open={openDeposit}
						setOpen={setOpenDeposit}
						handleOpen={handleOpenDeposit}
						handleClose={handleCloseDeposit}
					/>
				</div>
				) :
				<ConnectFirstModal
					open={open}
					setOpen={setOpen}
					handleOpen={handleOpen}
					handleClose={handleClose}
					openDeposit={openDeposit}
					setOpenDeposit={setOpenDeposit}
					handleOpenDeposit={handleOpenDeposit}
					handleCloseDeposit={handleCloseDeposit}
					account={account}
					chainId={chainId}
					onUpdateAccount={onUpdateAccount}
				/>
			}
	</Box>
	);
}