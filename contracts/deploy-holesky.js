const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CryptoGig Escrow to Holesky Testnet...");
  console.log("=" .repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.error("❌ Insufficient balance! Get Holesky ETH from:");
    console.error("   - https://holesky-faucet.pk910.de");
    console.error("   - https://faucet.quicknode.com/ethereum/holesky");
    process.exit(1);
  }

  // Arbitrator address
  const arbitratorAddress = "0x6A413e4C59CFB5D4544D5ecA74dacf7848b3a483";
  console.log("🛡️  Arbitrator address:", arbitratorAddress);

  // Mock USDC on Holesky (you may need to deploy this first)
  const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
  console.log("💵 USDC address:", usdcAddress);

  console.log("\n⏳ Deploying CryptoGigEscrow contract...");
  
  const CryptoGigEscrow = await hre.ethers.getContractFactory("CryptoGigEscrow");
  const escrow = await CryptoGigEscrow.deploy(usdcAddress, arbitratorAddress);
  
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();

  console.log("\n✅ Deployment successful!");
  console.log("=" .repeat(60));
  console.log("📋 Contract Details:");
  console.log("   Escrow Address:", escrowAddress);
  console.log("   USDC Address:", usdcAddress);
  console.log("   Arbitrator:", arbitratorAddress);
  console.log("   Network: Holesky Testnet (Chain ID: 17000)");
  console.log("   Explorer:", `https://holesky.etherscan.io/address/${escrowAddress}`);
  console.log("=" .repeat(60));

  console.log("\n📝 Update your .env files:");
  console.log(`   VITE_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log(`   CONTRACT_ADDRESS=${escrowAddress}`);

  console.log("\n🔍 Verify contract (optional):");
  console.log(`   npx hardhat verify --network holesky ${escrowAddress} ${usdcAddress} ${arbitratorAddress}`);

  console.log("\n💡 Next steps:");
  console.log("   1. Update frontend/.env with new contract address");
  console.log("   2. Update backend/.env with new contract address");
  console.log("   3. Get test USDC from Holesky faucets");
  console.log("   4. Test the platform!");

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
