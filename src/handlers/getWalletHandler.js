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
    console.log("asdfasdfads")
    console.log(`Holaaa ${req.params.id}`) // ToDo dejarlo bonito el endpoint quedo provisorio
    const body = await walletService.getWalletData(req.params.id);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
