import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther, formatEther } from "ethers/lib/utils";
import { assert, expect } from "chai";
import { network, deployments, ethers, upgrades } from "hardhat";

const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

describe("Pool", function() {
  let accounts: SignerWithAddress[];
  let pool: Pool;
  let weth: WETH9;
  let thToken: ThToken;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const Weth = await ethers.getContractFactory("WETH9");
    weth = await Weth.deploy();
    console.log(`weth address: ${weth.address}`);
    const Pool = await ethers.getContractFactory("Pool");
    pool = await upgrades.deployProxy(Pool, []);
    await pool.deployed();
    const ThToken = await ethers.getContractFactory("ThToken");
    thToken = await upgrades.deployProxy(ThToken, [
      "WETH_thToken",
      "WETH_THT",
      weth.address,
    ]);
    await thToken.deployed();
    // thToken = await ThToken.deploy("WETH_thToken", "WETH_THT");
    // await thToken.initialize(weth.address);
    console.log(`thToken address: `, thToken.address);
    // await pool.initReserve(weth.address, thToken.address);
    // let reserve: DataTypes.ReserveStruct = await pool.getReserve(weth.address);
    // // console.log(`reserve init boolean val: ${bool}`);
    // console.log(`reserve: ${reserve}`);
    await weth.deposit({ value: parseEther("0.2") });
    console.log(
      `accounts[0] weth balance: `,
      await weth.balanceOf(accounts[0].address)
    );
  });

  describe("thToken initializer", () => {
    it("initializes the token correctly", async () => {
      const name = await thToken.name();
      const symbol = await thToken.symbol();
      const underlyingAddress = await thToken.getUnderlyingAsset();
      expect(name).to.equal("WETH_thToken");
      expect(symbol).to.equal("WETH_THT");
      expect(underlyingAddress).to.equal(weth.address);
    });
  });

  // describe("initialize", () => {
  //   it("initializes underlying asset address correctly", async () => {
  //     await thToken.initialize(weth.address);
  //     expect(await thToken.getUnderlyingAsset()).to.equal(weth.address);
  //   });
  // });

  describe("initialize reserve", () => {
    it("initialized a reserve correctly", async () => {
      await pool.initReserve(weth.address, thToken.address);
      let reserve: DataTypes.ReserveStruct = await pool.getReserve(
        weth.address
      );
      expect(reserve.thTokenAddress).to.equal(thToken.address);
    });
  });

  describe("deposit", () => {
    it("should mint thTokens upon deposit", async () => {
      await pool.initReserve(weth.address, thToken.address);
      console.log(
        `WETH balance of accounts[0] before deposit: `,
        await weth.balanceOf(accounts[0].address)
      );
      await weth.approve(pool.address, parseEther("0.5"));
      await pool.deposit(weth.address, parseEther("0.2"));
      expect(await thToken.balanceOf(accounts[0].address)).to.equal(
        parseEther("0.2")
      );
    });
  });

  describe("withdraw", () => {
    it("should burn thTokens upon withdrawal", async () => {
      await pool.initReserve(weth.address, thToken.address);
      let reserve: DataTypes.ReserveStruct = await pool.getReserve(
        weth.address
      );
      await weth.approve(pool.address, parseEther("0.5"));
      await pool.deposit(weth.address, parseEther("0.2"));
      const balanceOf = await thToken.balanceOf(accounts[0].address);
      console.log(`accounts[0] thToken balanceOf: `, balanceOf);
      await pool.withdraw(weth.address, parseEther("0.01"));
      const endingBalanceOf = await thToken.balanceOf(accounts[0].address);
      expect(endingBalanceOf).to.equal(parseEther("0.19"));
    });
  });
});
