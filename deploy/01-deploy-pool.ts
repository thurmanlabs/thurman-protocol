import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "ethers/lib/utils";
import { verify } from "../utils/verify";
import { upgrades } from "hardhat";
import usdcGoerli from "../abi/usdc-abi.json";
// import weth9Goerli from "../abi/weth9-abi.json";

// const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const USDC_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const developmentChains = ["hardhat", "localhost"];

const deployPool: DeployFunction = async function(
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, network } = hre;
  const { deploy, log } = deployments;
  const accounts: SignerWithAddress[] = await ethers.getSigners();
  const deployer = accounts[0];
  console.log("deployer address: ", deployer.address);
  const chainId: number = network.config.chainId!;
  let wethAddress: string;
  let weth: WETH9;
  let thToken: ThToken;

  log("------------------------------------------");
  log("Deploying Pool...");

  const Pool = await ethers.getContractFactory("Pool");
  let pool: Pool = await upgrades.deployProxy(Pool, []);
  await pool.deployTransaction.wait(1);
  const ThToken = await ethers.getContractFactory("ThToken");

  if (developmentChains.includes(network.name)) {
    const Weth = await ethers.getContractFactory("WETH9");
    weth = await Weth.deploy();
    await weth.deployed();
    wethAddress = weth.address;
    thToken = await upgrades.deployProxy(ThToken, [
      pool.address,
      "WETH_thToken",
      "WETH_THT",
      wethAddress,
    ]);

    await thToken.deployTransaction.wait(1);
    console.log(`wethThToken address: `, thToken.address);
    const pWethTx = await pool.initReserve(wethAddress, thToken.address);
    await pWethTx.wait();
    let wethReserve: DataTypes.ReserveStruct = await pool.getReserve(wethAddress);
    console.log(`weth reserve: ${wethReserve}`);
    await weth.deposit({ value: parseEther("0.01") });
    console.log(`accounts[0] weth balance: `, await weth.balanceOf(deployer.address));
  } else {
    console.log("Creating a new instance of USDC contract with deployer");
    const usdc = await new ethers.Contract(
      USDC_ADDRESS,
      usdcGoerli.abi,
      deployer
    );
    console.log("USDC Total Supply: ", await usdc.totalSupply());
    thToken = await upgrades.deployProxy(ThToken, [
      pool.address,
      "USDC_thToken",
      "USDC_THT",
      usdc.address,
    ]);
    await thToken.deployTransaction.wait(1);
    const pUsdcTx = await pool.initReserve(usdc.address, thToken.address);
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
