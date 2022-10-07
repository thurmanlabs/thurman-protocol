import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers/lib/utils";
import { verify } from "../utils/verify";
import { upgrades } from "hardhat";
import usdcGoerli from "../abi/usdc-abi.json";
import weth9Goerli from "../abi/weth9-abi.json";

const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const USDC_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const developmentChains = ["hardhat", "localhost"];

// CAN DELETE ALL THE WETH STUFF SINCE I'M LAUNCHING WITH USDC!!!

const deployPool: DeployFunction = async function(
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(`deployer info: `, deployer);
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
    const weth = await new ethers.Contract(
      wethAddress,
      weth9Goerli.abi,
      deployer
    );
    console.log("Live Address:\t" + weth.address);
    console.log(`Non Hardhat wethAddress: `, wethAddress);
  }

  log("------------------------------------------");
  log("Deploying Pool...");

  const Pool = await ethers.getContractFactory("Pool");
  let pool: Pool = await upgrades.deployProxy(Pool, []);
  await pool.deployTransaction.wait(1);
  const ThToken = await ethers.getContractFactory("ThToken");
  let wethThToken: ThToken = await upgrades.deployProxy(ThToken, [
    "WETH_thToken",
    "WETH_THT",
    weth.address,
  ]);

  await wethThToken.deployTransaction.wait(1);
  console.log(`wethThToken address: `, wethThToken.address);
  const pWethTx = await pool.initReserve(wethAddress, wethThToken.address);
  await pWethTx.wait();
  let wethReserve: DataTypes.ReserveStruct = await pool.getReserve(wethAddress);
  console.log(`weth reserve: ${wethReserve}`);
  await weth.deposit({ value: parseEther("0.01") });
  console.log(`accounts[0] weth balance: `, await weth.balanceOf(deployer));

  if (!developmentChains.includes(network.name)) {
    const usdc = await new ethers.Contract(
      USDC_ADDRESS,
      usdcGoerli.abi,
      deployer
    );
    console.log("USDC Total Supply: ", usdc.totalSupply());
    let usdcThToken: ThToken = await upgrades.deployProxy(ThToken, [
      "USDC_thToken",
      "USDC_THT",
      usdc.address,
    ]);
    await usdcThToken.deployTransaction.wait(1);
    pUsdcTx = await pool.initReserve(usdc.address, usdcThToken.address);
    await pUsdcTx.wait();
    let usdcReserve: DataTypes.ReserveStruct = await pool.getReserve(
      usdc.address
    );
    console.log(`usdc reserve: ${usdcReserve}`);
  }

  log("----------------------------------------------");
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(pool.address, []);
    await verify(thToken.address, []);
  }
};

export default deployPool;
deployPool.tags = ["all", "pool"];
