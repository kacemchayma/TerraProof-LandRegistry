const hre = require("hardhat");
const { updateFrontendConfig } = require("./updateConfig");
const { copyABI } = require("./copyABI");

async function main() {
  console.log("🚀 Déploiement automatique...");

  const [admin] = await hre.ethers.getSigners();
  console.log("Déploiement avec:", admin.address);

  const NFT = await hre.ethers.getContractFactory("LandNFT");
  const nft = await NFT.deploy(admin.address);
  await nft.waitForDeployment();
  console.log("✔ LandNFT deployed at:", await nft.getAddress());

  const Registry = await hre.ethers.getContractFactory("LandRegistry");
  const registry = await Registry.deploy(admin.address, await nft.getAddress());
  await registry.waitForDeployment();
  console.log("✔ LandRegistry deployed at:", await registry.getAddress());

  await nft.transferOwnership(await registry.getAddress());
  console.log("✔ Ownership NFT -> Registry");

  copyABI("LandNFT");
  copyABI("LandRegistry");

  updateFrontendConfig(await registry.getAddress());

  console.log("🎉 Déploiement COMPLET terminé !");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
