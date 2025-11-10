const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CryptoGig Escrow Contract...");
  
  // Contract addresses for Polygon Amoy Testnet
  const USDC_AMOY = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // USDC on Amoy
  const ARBITRATOR_ADDRESS = "0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"; // Designated arbitrator wallet
  
  console.log("📋 Deployment Configuration:");
  console.log(`   USDC Address: ${USDC_AMOY}`);
  console.log(`   Arbitrator: ${ARBITRATOR_ADDRESS}`);
  console.log("");
  
  // Get the contract factory
  const CryptoGigEscrow = await ethers.getContractFactory("CryptoGigEscrow");
  
  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const escrow = await CryptoGigEscrow.deploy(USDC_AMOY, ARBITRATOR_ADDRESS);
  
  // Wait for deployment
  await escrow.waitForDeployment();
  const contractAddress = await escrow.getAddress();
  
  console.log("");
  console.log("✅ Contract deployed successfully!");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log("");
  
  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const usdc = await escrow.usdc();
  const arbitrator = await escrow.arbitrator();
  
  console.log(`✅ USDC Address: ${usdc}`);
  console.log(`✅ Arbitrator: ${arbitrator}`);
  console.log("");
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    usdcAddress: USDC_AMOY,
    arbitratorAddress: ARBITRATOR_ADDRESS,
    network: "Polygon Amoy Testnet",
    deployedAt: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address
  };
  
  console.log("📝 Deployment Summary:");
  console.log("======================");
  console.log(`Contract: ${contractAddress}`);
  console.log(`Network: Polygon Amoy Testnet`);
  console.log(`USDC: ${USDC_AMOY}`);
  console.log(`Arbitrator: ${ARBITRATOR_ADDRESS}`);
  console.log("");
  
  console.log("🔧 Next Steps:");
  console.log("1. Update frontend/.env:");
  console.log(`   REACT_APP_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("2. Update backend/.env:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("3. Verify contract on Polygonscan:");
  console.log(`   npx hardhat verify --network polygonAmoy ${contractAddress} "${USDC_AMOY}" "${ARBITRATOR_ADDRESS}"`);
  console.log("");
  console.log("🎉 CryptoGig Escrow is ready for use!");
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });