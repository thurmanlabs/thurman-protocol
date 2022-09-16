import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";
import { network, deployments, ethers } from "hardhat";

const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

async function main() {
  let accounts: SignerWithAddress[];
  let pool: Pool;
  let weth: WETH9;
  let thToken: ThToken;

  accounts = await ethers.getSigners();
  const Weth = await ethers.getContractFactory("WETH9");
  weth = await Weth.deploy();
  console.log(`weth address: ${weth.address}`);
  const Pool = await ethers.getContractFactory("Pool");
  pool = await Pool.deploy();
  const ThToken = await ethers.getContractFactory("ThToken");
  thToken = await ThToken.deploy("WETH_thToken", "WETH_THT");
  await thToken.initialize(weth.address);
  console.log(`thToken address: `, thToken.address);
  await pool.initReserve(weth.address, thToken.address);
  let reserve: DataTypes.ReserveStruct = await pool.getReserve(weth.address);
  // console.log(`reserve init boolean val: ${bool}`);
  console.log(`weth reserve: ${reserve}`);
  await weth.deposit({ value: parseEther("0.2") });
  console.log(
    `accounts[0] weth balance: `,
    await weth.balanceOf(accounts[0].address)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
