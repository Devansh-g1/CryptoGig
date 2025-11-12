const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CryptoGig Escrow Contract to Sepolia...");
  
  // Contract addresses for Sepolia Testnet
  // USDC on Sepolia: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
  const USDC_SEPOLIA = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // USDC on Sepolia
  const ARBITRATOR_ADDRESS = "0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483"; // Designated arbitrator wallet
  
  console.log("📋 Deployment Configuration:");
  console.log(`   Network: Sepolia Testnet`);
  console.log(`   USDC Address: ${USDC_SEPOLIA}`);
  console.log(`   Arbitrator: ${ARBITRATOR_ADDRESS}`);
  console.log("");
  
  // Get deployer info
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    console.log("❌ Error: No deployer wallet configured!");
    console.log("💡 Set DEPLOYER_PRIVATE_KEY in your .env file");
    process.exit(1);
  }
  
  const deployer = signers[0];
  console.log(`   Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
  console.log("");
  
  if (balance === 0n) {
    console.log("❌ Error: Deployer has no ETH!");
    console.log("💡 Get Sepolia ETH from:");
    console.log("   - https://sepoliafaucet.com/");
    console.log("   - https://www.alchemy.com/faucets/ethereum-sepolia");
    console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    process.exit(1);
  }
  
  // Get the contract factory
  const CryptoGigEscrow = await ethers.getContractFactory("CryptoGigEscrow");
  
  // Deploy the contract
  console.log("⏳ Deploying contract...");
  const escrow = await CryptoGigEscrow.deploy(USDC_SEPOLIA, ARBITRATOR_ADDRESS);
  
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
    usdcAddress: USDC_SEPOLIA,
    arbitratorAddress: ARBITRATOR_ADDRESS,
    network: "Sepolia Testnet",
    chainId: 11155111,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };
  
  console.log("📝 Deployment Summary:");
  console.log("======================");
  console.log(`Contract: ${contractAddress}`);
  console.log(`Network: Sepolia Testnet`);
  console.log(`Chain ID: 11155111`);
  console.log(`USDC: ${USDC_SEPOLIA}`);
  console.log(`Arbitrator: ${ARBITRATOR_ADDRESS}`);
  console.log("");
  
  console.log("🔧 Next Steps:");
  console.log("");
  console.log("1. Update frontend/.env:");
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   VITE_USDC_ADDRESS=${USDC_SEPOLIA}`);
  console.log(`   VITE_CHAIN_ID=11155111`);
  console.log("");
  console.log("2. Update backend environment (Railway):");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log("");
  console.log("3. Get test USDC on Sepolia:");
  console.log(`   Visit: https://faucet.circle.com/`);
  console.log(`   Or use: https://www.circle.com/en/usdc-sepolia-faucet`);
  console.log("");
  console.log("4. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress} "${USDC_SEPOLIA}" "${ARBITRATOR_ADDRESS}"`);
  console.log("");
  console.log("5. View on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("");
  console.log("🎉 CryptoGig Escrow is ready for testing on Sepolia!");
  
  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
