function schema() {
  return {
    params: {
      type: "object",
      properties: {
        sourcePrivateKey: {
          type: "string",
        },
        destinationAddress: {
          type: "string",
        },
        amount: {
          type: "number",
          exclusiveMinimum: 0
        },
      },
    },
    required: ["sourcePrivateKey", "destinationAddress", "amount"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    console.log(`sourcePrivateKey: ${req.body.sourcePrivateKey} destinationAddress: ${req.body.destinationAddress} amount: ${req.body.amount}`)

    let sourceWallet = walletService.getWallet(req.body.sourcePrivateKey)
    const contractResponse = await contractInteraction.sendFunds(sourceWallet, req.body.destinationAddress, req.body.amount);

    if (contractResponse.status != "ok") {
      reply.code(500).send(contractResponse);
    }

    reply.code(200).send(contractResponse.result);
  };
}

module.exports = { schema, handler };
