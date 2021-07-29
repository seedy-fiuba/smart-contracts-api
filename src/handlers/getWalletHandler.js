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

function handler({ walletService }) {
  return async function (req, reply) {
    const body = await walletService.getWalletBalance(req.params.id);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
