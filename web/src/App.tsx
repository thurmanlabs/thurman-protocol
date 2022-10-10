import React, { useContext, useEffect, useState } from "react";
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

function App() {
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>();

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
  }, [currentAccount]);

  return (
    <AccountContext.Provider
      value={{
        account: currentAccount,
        accountBalance: balance,
        onUpdateAccount: setCurrentAccount,
        onUpdateBalance: setBalance,
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
  );
}

export default App;