require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./frontend/src/utils/artifacts/"
  },
  gas: 2100000,
   gasPrice: 8000000000,
};
