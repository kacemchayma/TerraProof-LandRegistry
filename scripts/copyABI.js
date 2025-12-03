const fs = require("fs");
const path = require("path");

function copyABI(contractName) {
  const source = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    `${contractName}.sol`,
    `${contractName}.json`
  );

  const destination = path.join(
    __dirname,
    "..",
    "frontend",
    "src",
    "abi",
    `${contractName}.json`
  );

  if (!fs.existsSync(source)) {
    console.error("❌ ABI introuvable pour :", contractName);
    return;
  }

  if (!fs.existsSync(path.dirname(destination))) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
  }

  fs.copyFileSync(source, destination);
  console.log("✔ ABI copiée :", contractName);
}

module.exports = { copyABI };
