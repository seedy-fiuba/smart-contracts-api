const BigNumber = require("bignumber.js");
const ethers = require("ethers");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const projects = {};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
) => {
  const bookBnb = await getContract(config, deployerWallet);
  const tx = await bookBnb.createProject(stagesCost.map(toWei), projectOwnerAddress, projectReviewerAddress);
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log();
      projects[tx.hash] = {
        projectId,
        stagesCost,
        projectOwnerAddress,
        projectReviewerAddress,
      };
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
    }
  });
  return tx;
};

const fundProject = ({ config }) => async (
  funderWallet,
  amountToFund,
  projectId,
) => {
  const seedyFiubaContract = await getContract(config, funderWallet);
  const tx = await seedyFiubaContract.fund(projectId, { value: toWei(amountToFund) });
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");

    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log(tx.hash);
      console.log(`funded project ${projectId} with ${firstEvent.args.funds} incoming from ${firstEvent.args.funder}`)
      // ToDo devolver toda esta info, persistir tx hash como recibo de la operacion
    } else {
      console.error(`Project not funded in tx ${tx.hash}`);
    }

    const secondEvent = receipt && receipt.events && receipt.events[1];
    console.log(secondEvent);
    if (secondEvent && secondEvent.event == "ProjectStarted") {
      const projectId = secondEvent.args.projectId.toNumber();
      console.log(tx.hash);
      console.log(`Project started ${projectId}`) // Supuestamente esto es que no queda mas missing amount
      // ToDo se podria devolver como un status nuevo del proyecto
    }
  });
  return tx;
};

const reviewProject = ({ config }) => async ( // El que firma el contrato tiene que ser el reviewer
  reviewerWallet,
  projectId,
  completedStage
) => {
  const bookBnb = await getContract(config, reviewerWallet);
  const tx = await bookBnb.setCompletedStage(projectId, completedStage)
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "StageCompleted") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log(`project ${projectId} completed stage ${firstEvent.args.stageCompleted}`);
      // ToDo se podria devolver esta info en el response
    } else {
      console.error(`Project not advanced from stage in tx ${tx.hash}`);
    }

    const secondEvent = receipt && receipt.events && receipt.events[0];
    console.log(secondEvent);
    if (secondEvent && secondEvent.event == "ProjectCompleted") {
      const projectId = secondEvent.args.projectId.toNumber();
      console.log(`project ${projectId} completed all stages !`);
      // ToDo se podria devolver esta info en el response
    }
  });
  return tx;
};

const getProject = () => async id => {
  console.log(`Getting project ${id}: ${projects[id]}`);
  return projects[id];
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies),
  reviewProject: reviewProject(dependencies),
});
