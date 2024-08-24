import { ethers } from "hardhat";
import {
  ETHStakingCollateral__factory,
} from "../typechain-types";

async function mainDefi() {
  const contractFactory = (await ethers.getContractFactory(
    "ETHStakingCollateral"
  )) as ETHStakingCollateral__factory;
  let ethStakingContract = await contractFactory.deploy();
  ethStakingContract = await ethStakingContract.waitForDeployment();

  console.log("L1 Contract deployed to:", await ethStakingContract.getAddress());

  const amount = 0.001;
  const amountInWei = ethers.parseEther(amount.toString());
  const signer = await ethers.provider.getSigner();
  const tx = await ethStakingContract.connect(signer).stake({
    value: amountInWei,
  });
  const receipt = await (tx.wait());
  console.log("Stake successful!", receipt);
}

mainDefi().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
