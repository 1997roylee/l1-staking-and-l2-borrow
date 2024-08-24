import { ethers } from "hardhat";
import { L2Borrow__factory } from "../typechain-types";

async function main() {
  const signer = await ethers.provider.getSigner();

  const mockErc20 = await ethers.getContractFactory("MockERC20");
  const mockErc20Instance = await mockErc20.deploy(
    "MockERC20",
    "MockERC20",
    18,
    ethers.parseEther("1000")
  );
  await mockErc20Instance.waitForDeployment();
  console.log("MockERC20 deployed to:", await mockErc20Instance.getAddress());
  const mockErc20Address = await mockErc20Instance.getAddress();
  const l2StorageContractFactory = (await ethers.getContractFactory(
    "L2Borrow"
  )) as L2Borrow__factory;
  let l2StorageContract = await l2StorageContractFactory.deploy(
    mockErc20Address,
    "0x102E0fA89Ca08aBCA2294a3039a3CaCb970CFc01",
    10000
  );
  await l2StorageContract.waitForDeployment();

  const l2StorageContractAddress = await l2StorageContract.getAddress();
  console.log("L2Storage deployed to:", l2StorageContractAddress);

  const transferTx = await mockErc20Instance
    .connect(signer)
    .transfer(l2StorageContractAddress, ethers.parseEther("1000"));
  await transferTx.wait();

  try {
    console.log(
      "Max Borrow",
      await l2StorageContract.getMaxBorrowAmount(signer.address)
    );

    console.log(
      "Defi Pre Balance:",
      await mockErc20Instance.balanceOf(l2StorageContractAddress)
    );
    await (
      await l2StorageContract.connect(signer).borrow(ethers.parseEther("0.001"))
    ).wait();

    const borrowBalance = await mockErc20Instance.balanceOf(signer.address);
    console.log("retrieveL1Balance", borrowBalance);

    console.log(
      "Defi Post Balance:",
      await mockErc20Instance.balanceOf(l2StorageContractAddress)
    );

    await (
      await mockErc20Instance.approve(
        l2StorageContractAddress,
        ethers.parseEther("0.001")
      )
    ).wait();

    const repayTx = await l2StorageContract
      .connect(signer)
      .repay(ethers.parseEther("0.001"));

    await repayTx.wait();
  } catch (error) {
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
