var EasyContract = artifacts.require("./EasyContract.sol");

module.exports = function(deployer) {
  deployer.deploy(EasyContract);
};
