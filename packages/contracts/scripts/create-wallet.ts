import { ethers } from "hardhat";

const polygonRPC = "YOUR_HTTPS_ALCHEMY_URL"
const provider = new ethers.JsonRpcProvider(polygonRPC)
const wallet = ethers.Wallet.createRandom(provider)

const privKey = wallet.privateKey
console.log(wallet)
console.log(privKey)