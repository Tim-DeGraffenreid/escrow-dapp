const { ethers } = require("ethers"); 
const hre = require("hardhat"); 

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance (raw in Wei):", balance.toString());

  const value = hre.ethers.parseEther("2"); 

  console.log("Parsed Ether value:", value.toString());

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  
  
  const escrow = await Escrow.deploy({ value });
  const receipt = await escrow.waitForDeployment(); 

  console.log("Escrow contract deployed to:", receipt.target); 
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in main function:", error);
    process.exit(1);
  });
