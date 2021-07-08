const BigNumber = require("bignumber.js");
const ethers = require("ethers");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const weiToEthers = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(-18);
  return BigNumber(number.toString()).times(WEIS_IN_ETHER).toFixed();
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
  return tx.wait(1).then(receipt => {
    console.log("Transaction mined");

    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    
    if (firstEvent && firstEvent.event == "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();

      projects[tx.hash] = {
        projectId,
        stagesCost,
        projectOwnerAddress,
        projectReviewerAddress,
      };

      return {
        status: "ok",
        result: {
          txHash: tx.hash, // Si no funciona utilizar JSON.stringify(tx)
          projectWalletId: projectId,
          stagesCost: stagesCost,
          projectOwnerAddress: projectOwnerAddress,
          projectReviewerAddress: projectReviewerAddress,
          projectStatus: "FUNDING",
          currentStage: 0,
          missingAmount: stagesCost.reduce((accumulator, currentValue) => accumulator + currentValue)
        }
      }
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
      
      return {
        status: "failed",
        error: `Couldn't create project in tx ${tx.hash}`
      }
    }
  }).catch(e => {
    console.log(e)

    return {
        status: "failed",
        error: `Tx throwed exception: ${e}`
    }
  });
};

const fundProject = ({ config }) => async (
  funderWallet,
  amountToFund,
  projectId,
) => {
  const seedyFiubaContract = await getContract(config, funderWallet);
  const tx = await seedyFiubaContract.fund(projectId, { value: toWei(amountToFund) });
  return tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    response = {}

    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);

    if (firstEvent && firstEvent.event == "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();
      const fundsReceived = weiToEthers(firstEvent.args.funds);
      const missingAmount = weiToEthers(firstEvent.args.missingAmount);
      console.log(`funded project ${projectId} with ${firstEvent.args.funds} incoming from ${firstEvent.args.funder} in tx ${tx.hash}. missing amount ${missingAmount}`)

      response = {
        status: "ok",
        result: {
          txHash: tx.hash,
          projectWalletId: projectId,
          fundsReceived: fundsReceived,
          funderAddress: firstEvent.args.funder,
          missingAmount: missingAmount,
          projectStatus: "FUNDING", // Cambiar estos valores si llega a haber segundo evento
        }
      }
    } else {
      console.error(`Project not funded in tx ${tx.hash}`);
      return {
        status: "failed",
        error: `Couldn't fund project in tx ${tx.hash}`
      }
    }

    const secondEvent = receipt && receipt.events && receipt.events[1];
    console.log(secondEvent);

    if (secondEvent && secondEvent.event == "ProjectStarted") {
      const projectId = secondEvent.args.projectId.toNumber();

      console.log(`Project started ${projectId} in tx ${tx.hash}`)

      response['result']['projectStatus'] = "IN_PROGRESS"
    }

    return response
  }).catch(e => {
    console.log(e)

    return {
        status: "failed",
        error: `Tx throwed exception: ${e}`
    }
  });
};

const reviewProject = ({ config }) => async ( // El que firma el contrato tiene que ser el reviewer
  reviewerWallet,
  projectId,
  completedStage
) => {
  const bookBnb = await getContract(config, reviewerWallet);
  const tx = await bookBnb.setCompletedStage(projectId, completedStage)
  return tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    response = {}

    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);

    if (firstEvent && firstEvent.event == "StageCompleted") {
      const projectId = firstEvent.args.projectId.toNumber();
      const stageCompleted = firstEvent.args.stageCompleted.toNumber();

      console.log(`project ${projectId} completed stage ${firstEvent.args.stageCompleted}`);
      
      response = {
        status: "ok",
        result: {
          txHash: tx.hash,
          projectWalletId: projectId,
          stageCompleted: stageCompleted,
          projectStatus: "IN_PROGRESS", // Cambiar estos valores si llega a haber segundo evento
        }
      }
    } else {
      console.error(`Project not funded in tx ${tx.hash}`);
      return {
        status: "failed",
        error: `Couldn't fund project in tx ${tx.hash}`
      }
    }

    const secondEvent = receipt && receipt.events && receipt.events[1];
    console.log(secondEvent);
    if (secondEvent && secondEvent.event == "ProjectCompleted") {
      const projectId = secondEvent.args.projectId.toNumber();
      console.log(`project ${projectId} completed all stages !`);
      
      response['result']['projectStatus'] = "COMPLETED"
    }

    return response
  }).catch(e => {
    console.log(e)

    return {
        status: "failed",
        error: `Tx throwed exception: ${e}`
    }
  });
};

const getProject = ({ config }) => async (id, deployerWallet) => {
  const bookBnb = await getContract(config, deployerWallet);
  const projectStruct = await bookBnb.projects(id);
  console.log(`projectStruct ${projectStruct}`)
  return projectStruct
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies),
  reviewProject: reviewProject(dependencies),
});
