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
    const tx = contractInteraction.reviewProject(reviewerWallet, req.params.projectId, req.body.completedStage);

    console.log(tx)

    reply.code(200).send({
      projectId: req.params.projectId,
      completedStage: req.body.completedStage,
      tx: JSON.stringify(tx)
    });
  };
}

module.exports = { schema, handler };
