const ethers = require("ethers");
const accounts = [];

const getDeployerWallet = ({ config }) => () => {
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = () => async () => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  accounts.push({
    address: wallet.address,
    privateKey: wallet.privateKey,
  });
  const result = {
    id: accounts.length,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  return result;
};

const getWalletsData = () => () => {
  return accounts;
};

const getWalletBalance = () => async privateKey => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);
  return {balance: ethers.utils.formatEther(balance)};
};

const getWalletData = () => index => {
  return accounts[index - 1];
}

const getWallet = ({}) => privateKey => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);

  return new ethers.Wallet(privateKey, provider);
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWalletBalance: getWalletBalance({ config }),
  getWallet: getWallet({ config }),
});
