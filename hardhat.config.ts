import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "dotenv/config";

const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL || "https://eth-rinkbey/example";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
console.log(GOERLI_RPC_URL);

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY!],
      chainId: 5,
    },
  },
  solidity: "0.8.8",
};

export default config;
