import React, { useEffect, useState } from "react";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import { ethers } from "ethers";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import { AccountContext } from "./context/AccountContext";
import Header from "./Header";
import Home from "./routes/Home";

let theme = createTheme({
  typography: {
    fontFamily: [
      "Space Grotesk", 
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxSizing: "border-box",
          borderRadius: "0",
          textTransform: "none",
          margin: "1.0em 1.5em 1.0em 0.0em",
          padding: "0.5em 2.5em 0.5em 2.5em",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();
  const [chainId, setChainId] = useState<string | undefined>();

  useEffect(() => {
    async function fetchAccounts() {
      if (!window.ethereum) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      try {
        await provider.send("eth_accounts", []).then((accounts) => {
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
          } else {
            setCurrentAccount(undefined);
          }
        });
      } catch (e) {
        console.error(e);
        setCurrentAccount(undefined);
      }
      window.ethereum.on('accountsChanged', (_accounts) => window.location.reload());
    }

    fetchAccounts();
  }, []);

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount || !ethers.utils.isAddress(currentAccount)) {
        return;
      }
      if (!window.ethereum) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      try {
        await provider.getBalance(currentAccount).then((result) => {
          setBalance(ethers.utils.formatEther(result));
        });
      } catch (e) {
        console.error(e);
        setBalance(undefined);
      }
    }
    fetchBalance();
  }, [currentAccount, balance]);

  useEffect(() => {
    async function fetchChainId() {
      if (!window.ethereum) {
        return;
      }

      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      try {
        await provider.send("eth_chainId", []).then((chainId) => {
          console.log(chainId);
          setChainId(chainId);
        })
      } catch (e) {
        console.error(e);
        setChainId(undefined);
      }

      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }
    fetchChainId();
  }, [chainId]);

  return (
    <ThemeProvider theme={theme}>
    <AccountContext.Provider
      value={{
        account: currentAccount,
        accountBalance: balance,
        chainId: chainId,
        onUpdateAccount: setCurrentAccount,
        onUpdateBalance: setBalance,
        onUpdateChainId: setChainId,
      }}
    >
      <div className="App">
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AccountContext.Provider>
    </ThemeProvider>
  );
}

export default App;