import { ethers } from "hardhat";

async function main() {
  const l2StorageContractFactory = await ethers.getContractAt(
    "ETHStakingCollateral",
    "0x102E0fA89Ca08aBCA2294a3039a3CaCb970CFc01"
  );

  const signer = await ethers.provider.getSigner();
  const balance = await l2StorageContractFactory
    .connect(signer)
    .getStakedBalance();
  console.log("balance", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
