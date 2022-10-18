import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { verify } from "../utils/verify";
import { upgrades } from "hardhat";
import usdcGoerli from "../abi/usdc-abi.json";
import usdcMainnet from "../abi/usdc-mainnet-abi.json";

const USDC_ADDRESS_GOERLI = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
const USDC_ADDRESS_MAINNET = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH_DECIMALS = 18;
const USDC_DECIMALS = 6;
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
  let usdcAddress: string;
  let usdcAbi: any;
  let weth: WETH9;
  let thToken: ThToken;

  log("------------------------------------------");
  log("Deploying Pool...");

  const Pool = await ethers.getContractFactory("Pool");
  let pool: Pool = await upgrades.deployProxy(Pool, [], {gasPrice: parseUnits("28", "gwei")});
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
      WETH_DECIMALS,
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

    if (network.name === "mainnet") {
      usdcAddress = USDC_ADDRESS_MAINNET;
      usdcAbi = usdcMainnet.abi;
      console.log("mainnet config address + abi");
    } else {
      usdcAddress = USDC_ADDRESS_GOERLI;
      usdcAbi = usdcGoerli.abi;
      console.log("goerli config address + abi")
    }

    const usdc = await new ethers.Contract(
      usdcAddress,
      usdcAbi,
      deployer
    );
    console.log("USDC Total Supply: ", await usdc.totalSupply());
    thToken = await upgrades.deployProxy(ThToken, [
      pool.address,
      "USDC_thToken",
      "USDC_THT",
      usdc.address,
      USDC_DECIMALS,
    ], {gasPrice: parseUnits("28", "gwei")});
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
