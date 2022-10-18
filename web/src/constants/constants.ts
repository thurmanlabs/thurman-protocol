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
export const POOL_ADDRESS_GOERLI = "0xf9e1E3518Cc9E88266402Fdb288596dD71D4d7de";
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