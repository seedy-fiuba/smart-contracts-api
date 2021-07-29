
function handler() {
  return async function (req, reply) {
    const body = 'SeedyFiuba Smart Contract :)';
    reply.code(200).send(body);
  };
}

module.exports = { handler };
