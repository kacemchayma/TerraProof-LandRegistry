require("@nomicfoundation/hardhat-toolbox");

// ⬇⬇⬇ AJOUTE LA TÂCHE ICI ⬇⬇⬇
task("accounts", "Affiche les comptes Hardhat", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const acc of accounts) {
    console.log(acc.address);
  }
});
// ⬆⬆⬆ FIN DE LA TÂCHE ⬆⬆⬆

module.exports = {
  solidity: "0.8.20",

  networks: {
    hardhat: {},
    // autres réseaux si besoin (sepolia, etc.)
  },
};
