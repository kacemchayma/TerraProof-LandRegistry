const fs = require("fs");
const path = require("path");

function updateFrontendConfig(contractAddress) {
  const configPath = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "config.js"
  );

  const content = `
// 🚀 Fichier généré automatiquement par Hardhat
// Ne pas modifier à la main !

export const LAND_REGISTRY_ADDRESS = "${contractAddress}";
export const RPC_URL = "http://127.0.0.1:8545";
`;

  fs.writeFileSync(configPath, content);
  console.log("✅ config.js mis à jour avec :", contractAddress);
}

module.exports = { updateFrontendConfig };
