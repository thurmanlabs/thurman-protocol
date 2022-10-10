import React, { useContext } from "react";
import {
	Box,
	Button,
} from "@mui/material";
import { ethers, Contract } from "ethers";
import { AccountContext } from "../context/AccountContext";
import contract from "../constants/Pool.json";
import thContract from "../constants/ThToken.json";
import weth9contract from "../constants/WETH9.json";

const POOL_ADDRESS = "0x5FDAb857C869aC4010Fe8539276932744aC2B2aB";
const TH_TOKEN_ADDRESS = "0x29dAdCC947326E9E2e9add1D0f86CF36c5b9d49D";
const WETH_ADDRESS = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

export default function Home() {
	const { account } = useContext(AccountContext);

	const onClickDeposit = async (event: any) => {
	  event.preventDefault();
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const signer = await provider.getSigner();
	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS,
	    contract.abi,
	    signer
	  );

	  const weth: Contract = new ethers.Contract(
	    WETH_ADDRESS,
	    weth9contract,
	    signer
	  );
	  await weth.approve(pool.address, ethers.utils.parseEther("0.005"));
	  const tx = await pool.deposit(
	    WETH_ADDRESS,
	    ethers.utils.parseEther("0.001"),
	    {
	      gasPrice: 6000000,
	      gasLimit: 30000000,
	    }
	  );
	  console.log(tx);
	  const tr = await tx.wait(1);
	  console.log(tr);
	  console.log(tx.hash);
	  console.log("deposited to the pool!");
	};

	const onClickWithdraw = async (event: any) => {
	  event.preventDefault();
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const signer = await provider.getSigner();
	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS,
	    contract.abi,
	    signer
	  );

	  const tx = await pool.withdraw(
	    WETH_ADDRESS,
	    ethers.utils.parseEther("0.00025"),
	    {
	      gasPrice: 6000000,
	      gasLimit: 30000000,
	    }
	  );
	  console.log(tx);
	  const tr = await tx.wait(1);
	  console.log(tr);
	  console.log(tx.hash);
	  console.log("withdraw sucess!");
	};

	const onClickGetReserve = async () => {
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const pool: Contract = new ethers.Contract(
	    POOL_ADDRESS,
	    contract.abi,
	    provider
	  );
	  const reserve: any = await pool.getReserve(WETH_ADDRESS);
	  console.log(reserve);
	};

	const onClickGetUnderlyingAsset = async () => {
	  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	  const thToken = new ethers.Contract(
	    TH_TOKEN_ADDRESS,
	    thContract.abi,
	    provider
	  );
	  const underlying: any = await thToken.getUnderlyingAsset();
	  console.log(underlying);
	};

	return (
		<Box>
			{account && <Button onClick={onClickDeposit}>Deposit</Button>}
			{account && (
			  <Button onClick={onClickGetReserve}>Get Reserve</Button>
			)}
			{account && (
			  <Button onClick={onClickGetUnderlyingAsset}>Get Underlying</Button>
			)}
			{account && <Button onClick={onClickWithdraw}>Withdraw</Button>}
		</Box>
	);
}