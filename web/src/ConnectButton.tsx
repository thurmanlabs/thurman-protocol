import React, { useContext } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import { AccountContext } from "./context/AccountContext";

export default function ConnectButton() {
  const {
    account,
    accountBalance,
    onUpdateAccount,
    onUpdateBalance,
  } = useContext(AccountContext);

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
        <Typography variant="body1" sx={{color: "black"}}>
          {account.substring(0,3)}...{account.substring(account.length - 3, account.length)}
        </Typography>
      ) : (
        <Button onClick={onClickConnect}>Connect</Button>
      )}
    </Box>
  );
}
