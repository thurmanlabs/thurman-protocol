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
export const POOL_ADDRESS_GOERLI = "0x35aE0944009Fb8f2498F75970e8c78CF6d3Aa59d";
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
      address: "0x07865c6e87b9f70255377e024ace6630c1eaa37f",
      abi: USDCJson.abi,
      decimals: USDC_DECIMALS,
    },
    "POOL": {
      address: "0x35aE0944009Fb8f2498F75970e8c78CF6d3Aa59d",
      abi: POOLJson.abi,
      decimals: DECIMALS,
    }
  }
}