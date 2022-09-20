import React from "react";
import { chain, configureChains, createClient } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { Web3ModalEthereum } from "@web3modal/ethereum";
import type { ConfigOptions } from "@web3modal/react";
import { ConnectButton, Web3ModalProvider } from "@web3modal/react";
import "./App.css";

const WC_PROJECT_ID = "c0746f4be8c97d0fa22a23575788f480";

const { chains, provider } = configureChains([chain.mainnet], [publicProvider()])

// Create wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors: Web3ModalEthereum.defaultConnectors({ chains, appName: 'web3Modal' }),
  provider
})

// Configure web3modal
const modalConfig: ConfigOptions = {
  projectId: WC_PROJECT_ID,
  theme: 'dark',
  accentColor: 'orange'
}

function App() {
  return (
    <Web3ModalProvider config={modalConfig} ethereumClient={wagmiClient}>
      <div className="App">
        <ConnectButton />
      </div>
    </Web3ModalProvider>
  );
}

export default App;
