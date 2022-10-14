import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { ethers } from "ethers";
import { AccountContext } from "./context/AccountContext";
import { chainMap } from "./constants/constants";
import metamaskIcon from "./images/metamask-icon.png";
import ethIcon from "./images/eth.png";

const styles = {
  connectButton: {
    marginLeft: "1.5em",
  },
  popperPaper: {
    padding: "0.75em 1.5em 1.5em 1.5em",
  },
  stack: {
    margin: "0.75em 0 0.75em 0",
  },
  typography: {
    margin: "0.75em 0 0.75em 0",
  },
  metamask: {
    width: "1.15em",
    height: "1.15em",
  },
  ethIcon: {
    width: "0.75em",
    height: "0.75em",
  },
  etherscan: {
    color: "black",
  },
};

export default function ConnectButton() {
  const {
    account,
    chainId,
    accountBalance,
    onUpdateAccount,
  } = useContext(AccountContext);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const networkChainId = !chainId ? "0x1" : chainId;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleEthereum = async () => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      await provider
        .send("eth_requestAccounts", [])
        .then((accounts) => {
          if (accounts.length > 0) {
            onUpdateAccount(accounts[0]);
          }
        })
        .catch((e) => console.log(e));
      } else {
        alert("You need to install MetaMask to connect a wallet");
        window.open("https://metamask.io/", "_blank");
        return;
      }
  }

  const onClickConnect = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (window.ethereum) {
      await handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
    }

    setTimeout(handleEthereum, 3000);
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
          startIcon={<Avatar src={metamaskIcon} sx={styles.metamask} />}
          endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        >
          {account.substring(0,4)}...{account.substring(account.length - 4, account.length)}
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Paper variant="outlined" sx={styles.popperPaper}>
            {chainId && (
              <Box>
                <Typography variant="body2" sx={{...styles.typography, fontWeight: "bold"}}>
                  Network
                </Typography>
                <Typography variant="body2" sx={styles.typography}>
                  {chainMap[networkChainId].name}
                </Typography>
                <Divider />
              </Box>
            )
          }
          {accountBalance && (
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={styles.stack}>
                <Avatar src={ethIcon} sx={styles.ethIcon} />
                <Typography variant="body2">
                  ETH Balance: {parseFloat(accountBalance).toFixed(3)}
                </Typography>
              </Stack>
              <Divider />
            </Box>
            )
          }
          {account && (
            <Box display="flex" flexDirection="row">
              <Typography variant="body2" sx={{...styles.typography, fontWeight: "bold"}}>
              <Link
                href={`${chainMap[networkChainId].etherscanUrl}/address/${account}`}
                target="_blank"
                sx={styles.etherscan}
              >
                Etherscan
              </Link>
              </Typography>
            </Box>
          )}
          </Paper>
        </Popper>
        </Box>
      ) : (
        <Button 
          variant="contained"
          startIcon={<Avatar src={metamaskIcon} sx={styles.metamask} />}
          sx={styles.connectButton}
          onClick={onClickConnect}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}