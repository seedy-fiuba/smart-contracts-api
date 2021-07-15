const getWallet = require("./handlers/getWalletHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createProject = require("./handlers/createProjectHandler");
const getProject = require("./handlers/getProjectHandler");
const fundProject = require("./handlers/fundProjectHandler")
const reviewProject = require("./handlers/reviewProjectHandler")
const sendFunds = require("./handlers/sendFundsHandler")

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallet/:id",
    schema: getWallet.schema(config),
    handler: getWallet.handler({ config, ...services }),
  };
}

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallet",
    schema: getWalletsData.schema(config),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallet",
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}

function createProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/project",
    schema: createProject.schema(config),
    handler: createProject.handler({ config, ...services }),
  };
}

function fundProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/fund/projects/:projectId",
    schema: fundProject.schema(config),
    handler: fundProject.handler({ config, ...services }),
  };
}

function reviewProjectRoute({ services, config }) {
  return {
    method: "PUT",
    url: "/projects/:projectId",
    schema: reviewProject.schema(config),
    handler: reviewProject.handler({ config, ...services }),
  };
}

function getProjectRoute({ services, config }) {
  return {
    method: "GET",
    url: "/project/:id",
    schema: getProject.schema(config),
    handler: getProject.handler({ config, ...services }),
  };
}

function transferFunds({ services, config }) {
  return {
    method: "POST",
    url: "/transfer/funds",
    schema: sendFunds.schema(config),
    handler: sendFunds.handler({ config, ...services }),
  };
}

module.exports = [getWalletDataRoute, getWalletsDataRoute, createWalletRoute, createProjectRoute, getProjectRoute, fundProjectRoute, reviewProjectRoute, transferFunds];
