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
  const l2BorrowContractFactory = (await ethers.getContractFactory(
    "L2Borrow"
  )) as L2Borrow__factory;
  let l2BorrowContract = await l2BorrowContractFactory.deploy(
    mockErc20Address,
    "0xf1571F6cF090BDD2f87368098CBbaDFe00682fd0", // Replace with L1 address
    10000
  );
  await l2BorrowContract.waitForDeployment();

  const l2BorrowContractAddress = await l2BorrowContract.getAddress();
  console.log("L2 Contract deployed to:", l2BorrowContractAddress);

  const transferTx = await mockErc20Instance
    .connect(signer)
    .transfer(l2BorrowContractAddress, ethers.parseEther("1000"));
  await transferTx.wait();

  try {
    console.log(
      "Max Borrow",
      await l2BorrowContract.getMaxBorrowAmount(signer.address)
    );

    console.log(
      "Defi Pre Balance:",
      await mockErc20Instance.balanceOf(l2BorrowContractAddress)
    );
    await (
      await l2BorrowContract.connect(signer).borrow(ethers.parseEther("0.001"))
    ).wait();

    const borrowBalance = await mockErc20Instance.balanceOf(signer.address);
    console.log("retrieveL1Balance", borrowBalance);

    console.log(
      "Defi Post Balance:",
      await mockErc20Instance.balanceOf(l2BorrowContractAddress)
    );

    await (
      await mockErc20Instance.approve(
        l2BorrowContractAddress,
        ethers.parseEther("0.001")
      )
    ).wait();

    const repayTx = await l2BorrowContract
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
