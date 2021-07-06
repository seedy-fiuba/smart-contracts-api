function schema() {
  return {
    params: {
      type: "object",
      properties: {
        projectId: {
          type: "integer",
        },
        completedStage: {
          type: "integer",
        },
        reviewerPrivateKey: {
          type: "string",
        }
      },
    },
    required: ["projectId", "completedStage", "reviewerPrivateKey"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    console.log(`project_id: ${req.params.projectId} completedStage: ${req.body.completedStage}`)

    let reviewerWallet = walletService.getWallet(req.body.reviewerPrivateKey)
    const contractResponse = await contractInteraction.reviewProject(reviewerWallet, req.params.projectId, req.body.completedStage);

    if (contractResponse.status != "ok") {
      reply.code(500).send(contractResponse);
    }

    reply.code(200).send(contractResponse.result);
  };
}

module.exports = { schema, handler };
