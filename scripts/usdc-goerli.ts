import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";
import { network, deployments, ethers } from "hardhat";
import usdcGoerli from "../abi/usdc-abi.json";
import weth9Goerli from "../abi/weth9-abi.json";

const USDC_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const WETH9_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

async function main() {
  const accounts: SignerWithAddress[] = await ethers.getSigners();

  // uses USDC proxy address and implementation contract ABI
  const usdc = await new ethers.Contract(
    USDC_ADDRESS,
    usdcGoerli.abi,
    accounts[0]
  );
  const weth9 = await new ethers.Contract(
    WETH9_ADDRESS,
    weth9Goerli.abi,
    accounts[0]
  );
  console.log("USDC Address: ", usdc.address);
  console.log("USDC Total Supply: ", await usdc.totalSupply());
  console.log("WETH9 Total Supply: ", await weth9.totalSupply());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
