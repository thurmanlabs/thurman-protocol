import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";
import { assert, expect } from "chai";
import { network, deployments, ethers } from "hardhat";

describe("Pool", function() {
  let accounts: SignerWithAddress[];
  let pool: Pool;
  let thToken: ThToken;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const Pool = await ethers.getContractFactory("Pool");
    pool = await Pool.deploy();
    const ThToken = await ethers.getContractFactory("ThToken");
    thToken = await ThToken.deploy();
    await pool.setThToken(thToken.address);
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
      console.log(balanceOf);
      await pool.withdraw(accounts[0].address);
      const endingBalanceOf = await thToken.balanceOf(accounts[0].address);
      console.log(endingBalanceOf);
      expect(endingBalanceOf).to.equal(parseEther("0.0"));
    });
  });
});
