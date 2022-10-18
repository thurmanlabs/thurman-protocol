import USDCJson from "./USDC-ABI.json";
import POOLJson from "./Pool.json";

interface IChainMap {
  [key: string]: {
    name: string;
    etherscanUrl: string;
  };
} 

export const chainMap: IChainMap = {
  "0x1": {
    name: "Ethereum Mainnet",
    etherscanUrl: "https://etherscan.io"
  },
  "0x5": {
    name: "Goerli Testnet",
    etherscanUrl: "https://goerli.etherscan.io"
  }
}

export const USDC_ADDRESS_GOERLI = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
export const USDC_ADDRESS_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const POOL_ADDRESS_GOERLI = "0xf9e1E3518Cc9E88266402Fdb288596dD71D4d7de";
export const POOL_ADDRESS_MAINNET = "0x199a064eEE506c16b46e2D023cf0E770a80db173"
export const USDC_DECIMALS = 6;
export const DECIMALS = 18;

interface INetworkContractMap {
  [key: string]: {
    [contract: string]: {
      address: string;
      abi?: any;
      decimals?: number;
    }
  }
}

export const NetworkContractMap: INetworkContractMap = {
  "0x1": {
    "USDC": {
      address: USDC_ADDRESS_MAINNET,
      abi: USDCJson.abi,
      decimals: USDC_DECIMALS,
    },
    "POOL": {
      address: POOL_ADDRESS_MAINNET,
      abi: POOLJson.abi,
      decimals: DECIMALS,
    }
  },
  "0x5": {
    "USDC": {
      address: USDC_ADDRESS_GOERLI,
      abi: USDCJson.abi,
      decimals: USDC_DECIMALS,
    },
    "POOL": {
      address: POOL_ADDRESS_GOERLI,
      abi: POOLJson.abi,
      decimals: DECIMALS,
    }
  }
}