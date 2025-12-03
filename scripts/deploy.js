const hre = require("hardhat");
const { updateFrontendConfig } = require("./updateConfig");
const { copyABI } = require("./copyABI");

async function main() {
  const [admin] = await hre.ethers.getSigners();
  console.log("Deploying with:", admin.address);

  // Déployer NFT
  const NFT = await hre.ethers.getContractFactory("LandNFT");
  const nft = await NFT.deploy(admin.address);
  await nft.waitForDeployment();
  console.log("LandNFT deployed at:", await nft.getAddress());

  // Déployer Registry
  const Registry = await hre.ethers.getContractFactory("LandRegistry");
  const registry = await Registry.deploy(admin.address, await nft.getAddress());
  await registry.waitForDeployment();
  console.log("LandRegistry deployed at:", await registry.getAddress());

  // Transférer ownership NFT -> Registry
  await nft.transferOwnership(await registry.getAddress());
  console.log("NFT ownership transferred");

  // Copier ABI pour frontend
  copyABI("LandNFT");
  copyABI("LandRegistry");

  // Mettre à jour config.js
  updateFrontendConfig(await registry.getAddress());

  console.log("🚀 Déploiement terminé !");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
