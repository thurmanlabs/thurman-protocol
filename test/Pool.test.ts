import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther, formatEther } from "ethers/lib/utils";
import { assert, expect } from "chai";
import { network, deployments, ethers, upgrades } from "hardhat";

const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const WETH_DECIMALS = 18;

describe("Pool", function() {
  let accounts: SignerWithAddress[];
  let pool: Pool;
  let weth: WETH9;
  let thToken: ThToken;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const Weth = await ethers.getContractFactory("WETH9");
    weth = await Weth.deploy();
    const Pool = await ethers.getContractFactory("Pool");
    pool = await upgrades.deployProxy(Pool, []);
    await pool.deployed();
    const ThToken = await ethers.getContractFactory("ThToken");
    thToken = await upgrades.deployProxy(ThToken, [
      pool.address,
      "WETH_thToken",
      "WETH_THT",
      weth.address,
      WETH_DECIMALS,
    ]);
    await thToken.deployed();
    await weth.deposit({ value: parseEther("0.2") });
  });

  describe("thToken initializer", () => {

    it("emits an Initialized event", async () => {
      const ThToken = await ethers.getContractFactory("ThToken");
      expect( await upgrades.deployProxy(ThToken, [
        pool.address,
        "WETH_thToken",
        "WETH_THT",
        weth.address,
        WETH_DECIMALS,
      ]))
      .to.emit(thToken, "Initialized")
      .withArgs(weth.address, pool.address, WETH_DECIMALS);
    })

    it("initializes the token correctly", async () => {
      const name = await thToken.name();
      const symbol = await thToken.symbol();
      const underlyingAddress = await thToken.getUnderlyingAsset();
      const decimals = await thToken.decimals();
      expect(name).to.equal("WETH_thToken");
      expect(symbol).to.equal("WETH_THT");
      expect(underlyingAddress).to.equal(weth.address);
      expect(decimals).to.equal(WETH_DECIMALS);
    });
  });

  describe("initialize reserve", () => {

    it("initialized a reserve correctly", async () => {
      await pool.initReserve(weth.address, thToken.address);
      let reserve: DataTypes.ReserveStruct = await pool.getReserve(
        weth.address
      );
      expect(reserve.thTokenAddress).to.equal(thToken.address);
    });

    it("reverts when a reserve has already been added", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await expect(
        pool.initReserve(weth.address, thToken.address)
      ).to.be.revertedWithCustomError(pool, "RESERVE_ALREADY_ADDED");
    });

    it("reverts when using another signer besides the deployer", async () => {
      await expect(
        pool.connect(accounts[1]).initReserve(weth.address, thToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("deposit", () => {
    it("should emit deposit event", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await weth.approve(pool.address, parseEther("0.5"));
      await expect(pool.deposit(weth.address, parseEther("0.2")))
        .to.emit(pool, "Deposit")
        .withArgs(weth.address, accounts[0].address, parseEther("0.2"));
    });

    it("mint should revert when called by sender besides initialized pool", async () => {
      await expect(thToken.mint(accounts[0].address, parseEther("0.05"))).to.be
        .reverted;
    });

    it("deposit should revert when amount 0 is sent by message sender", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await weth.approve(pool.address, parseEther("0.5"));
      await expect(
        pool.deposit(weth.address, parseEther("0"))
      ).to.be.revertedWithCustomError(pool, "INVALID_AMOUNT");
    });

    it("should mint an equivalent amount of thTokens upon deposit", async () => {
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
    it("should emit deposit event", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await weth.approve(pool.address, parseEther("0.5"));
      await pool.deposit(weth.address, parseEther("0.2"));
      await expect(pool.withdraw(weth.address, parseEther("0.1")))
        .to.emit(pool, "Withdraw")
        .withArgs(weth.address, accounts[0].address, parseEther("0.1"));
    });

    it("should revert when amount 0 is sent by message sender", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await weth.approve(pool.address, parseEther("0.5"));
      await pool.deposit(weth.address, parseEther("0.2"));
      await expect(
        pool.withdraw(weth.address, parseEther("0.0"))
      ).to.be.revertedWithCustomError(pool, "INVALID_AMOUNT");
    });

    it("should revert when amount sent to withdraw is greater than message sender balance", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await weth.approve(pool.address, parseEther("0.5"));
      await pool.deposit(weth.address, parseEther("0.2"));
      await expect(
        pool.withdraw(weth.address, parseEther("0.3"))
      ).to.be.revertedWithCustomError(pool, "NOT_ENOUGH_IN_USER_BALANCE");
    });

    it("burn should revert when called by sender besides initialized pool", async () => {
      await pool.initReserve(weth.address, thToken.address);
      await weth.approve(pool.address, parseEther("0.5"));
      await pool.deposit(weth.address, parseEther("0.2"));
      await expect(thToken.burn(accounts[0].address, parseEther("0.05"))).to.be
        .reverted;
    });

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
