const hre = require("hardhat");

async function main() {
  console.log("Deploying CryptoGig Escrow Contract...");

  // Polygon Amoy Testnet addresses
  const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router
  const USDC = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // USDC on Amoy

  const CryptoGigEscrow = await hre.ethers.getContractFactory("CryptoGigEscrow");
  const escrow = await CryptoGigEscrow.deploy(SWAP_ROUTER, USDC);

  await escrow.waitForDeployment();
  const address = await escrow.getAddress();

  console.log("\n✅ CryptoGigEscrow deployed to:", address);
  console.log("\n📝 Save this address to your .env file:");
  console.log(`CONTRACT_ADDRESS=${address}`);
  console.log("\n⚠️  Don't forget to set the arbitrator address using setArbitrator()");
  
  // Wait for block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await escrow.deploymentTransaction().wait(5);
  
  console.log("\n🔍 Verifying contract on PolygonScan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [SWAP_ROUTER, USDC],
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    console.log("❌ Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });