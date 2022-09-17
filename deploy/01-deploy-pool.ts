import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers/lib/utils";

const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

const deployPool: DeployFunction = async function(
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = network.config.chainId!;
  console.log(`chainId: `, chainId);
  let wethAddress: string;
  let weth: WETH9;
  if (chainId == 31337) {
    const Weth = await ethers.getContractFactory("WETH9");
    weth = await Weth.deploy();
    await weth.deployed();
    wethAddress = weth.address;
  } else {
    wethAddress = WETH_ADDRESS;
    const Weth = await ethers.getContractFactory("WETH9");
    weth = await Weth.attach(wethAddress);
    console.log("Live Address:\t" + weth.address);
    console.log(`Non Hardhat wethAddress: `, wethAddress);
  }
  log("------------------------------------------");
  log("Deploying Pool...");

  const Pool = await ethers.getContractFactory("Pool");
  let pool: Pool = await Pool.deploy();
  await pool.deployed();
  const ThToken = await ethers.getContractFactory("ThToken");
  let thToken: ThToken = await ThToken.deploy("WETH_thToken", "WETH_THT");
  await thToken.deployed();
  await thToken.initialize(wethAddress);
  console.log(`thToken address: `, thToken.address);
  await pool.initReserve(wethAddress, thToken.address);
  let reserve: DataTypes.ReserveStruct = await pool.getReserve(wethAddress);
  console.log(`weth reserve: ${reserve}`);
  await weth.deposit({ value: parseEther("0.2") });
  console.log(
    `accounts[0] weth balance: `,
    await weth.balanceOf(deployer.address)
  );
};

export default deployPool;
deployPool.tags = ["all", "pool"];
