function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    },
    required: ["id"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const body = await contractInteraction.getProject(req.params.id, walletService.getDeployerWallet());
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
