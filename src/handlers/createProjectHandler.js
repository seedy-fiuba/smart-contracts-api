function schema() {
  return {
    params: {
      type: "object",
      properties: {
        ownerPrivateKey: {
          type: "string",
        },
        reviewerPrivateKey: {
          type: "string",
        },
        stagesCost: {
          type: "array",
          minItems: 1,
          Items: { type: "number" },
        },
      },
    },
    required: ["ownerPrivateKey", "reviewerPrivateKey", "stagesCost"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    console.log(`ownerPrivateKey ${req.body.ownerPrivateKey}, reviewerPrivateKey ${req.body.reviewerPrivateKey}, stagesCost ${req.body.stagesCost}`)
    let contractResponse = await contractInteraction.createProject(
      walletService.getDeployerWallet(),
      req.body.stagesCost,
      walletService.getWallet(req.body.ownerPrivateKey).address,
      walletService.getWallet(req.body.reviewerPrivateKey).address,
    );

    if (contractResponse.status != "ok") {
      reply.code(500).send(contractResponse);
    }

    reply.code(200).send(contractResponse.result);
  };
}

module.exports = { schema, handler };
