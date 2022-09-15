import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";
import { assert, expect } from "chai";
import { network, deployments, ethers } from "hardhat";

const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

describe("Pool", function() {
  let accounts: SignerWithAddress[];
  let pool: Pool;
  let thToken: ThToken;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const Pool = await ethers.getContractFactory("Pool");
    pool = await Pool.deploy();
    const ThToken = await ethers.getContractFactory("ThToken");
    thToken = await ThToken.deploy("ETH_thToken", "ETH_THT");
    await pool.setThToken(thToken.address);
  });

  describe("constructor", () => {
    it("constructs the token correctly", async () => {
      const name = await thToken.name();
      const symbol = await thToken.symbol();
      expect(name).to.equal("ETH_thToken");
      expect(symbol).to.equal("ETH_THT");
    });
  });

  describe("initialize", () => {
    it("initializes underlying asset address correctly", async () => {
      await thToken.initialize(WETH_ADDRESS);
      expect(await thToken.getUnderlyingAsset()).to.equal(WETH_ADDRESS);
    });
  });

  describe("deposit", () => {
    it("should mint thTokens upon deposit", async () => {
      await pool.deposit({ value: parseEther("0.2") });
      expect(await thToken.balanceOf(accounts[0].address)).to.equal(
        parseEther("0.2")
      );
    });
  });

  describe("withdraw", () => {
    it("should burn thTokens upon withdrawal", async () => {
      await pool.deposit({ value: parseEther("0.2") });
      const balanceOf = await thToken.balanceOf(accounts[0].address);
      await pool.withdraw(accounts[0].address);
      const endingBalanceOf = await thToken.balanceOf(accounts[0].address);
      expect(endingBalanceOf).to.equal(parseEther("0.0"));
    });
  });
});
