const { ethers } = require("ethers"); 
const hre = require("hardhat"); 

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance (raw in Wei):", balance.toString());

  const value = hre.ethers.parseEther("1"); // Use hre.ethers for scope

  console.log("Parsed Ether value:", value.toString());

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  
  // Deploy the contract and wait for it to be mined
  const escrow = await Escrow.deploy({ value });
  const receipt = await escrow.waitForDeployment(); // Updated for ethers v6

  console.log("Escrow contract deployed to:", receipt.target); // Use `target` to get the contract address
}

// Catch errors if main() fails
main().catch((error) => {
  console.error("Error in main function:", error);
  process.exitCode = 1;
});


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in main function:", error);
    process.exit(1);
  });
