import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { ethers } from "ethers";
import { AccountContext } from "./context/AccountContext";
import { chainMap } from "./constants/constants";

const styles = {
  connectButton: {
    marginLeft: "1.5em",
  },
  popperPaper: {
    padding: "0.75em 1.5em 1.5em 1.5em",
  },
  typography: {
    margin: "0.75em 0 0.75em 0",
  },
};

export default function ConnectButton() {
  const {
    account,
    chainId,
    accountBalance,
    onUpdateAccount,
    onUpdateBalance,
  } = useContext(AccountContext);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

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
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <Box>
      {account ? (
        <Box>
        <Button
          variant="outlined"
          disableRipple={true}
          sx={styles.connectButton} 
          onClick={handleClick}
          endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        >
          {account.substring(0,4)}...{account.substring(account.length - 4, account.length)}
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Paper variant="outlined" elevation={5} sx={styles.popperPaper}>
            {chainId && (
              <Box>
                <Typography variant="body2" sx={{...styles.typography, fontWeight: "bold"}}>
                  Network
                </Typography>
                <Typography variant="body2" sx={styles.typography}>
                  {chainMap[chainId]}
                </Typography>
                <Divider />
              </Box>
            )
          }
          {accountBalance && (
            <Box>
              <Typography variant="body2" sx={styles.typography}>
                ETH Balance: {parseFloat(accountBalance).toFixed(3)}
              </Typography>
              <Divider />
            </Box>
            )
          }
          </Paper>
        </Popper>
        </Box>
      ) : (
        <Button variant="contained" sx={styles.connectButton} onClick={onClickConnect}>Connect Wallet</Button>
      )}
    </Box>
  );
}
