const { expressjwt: jwt } = require("express-jwt");
const api = process.env.API_URL;

function authJwt() {
  const secret = process.env.secret;
  return jwt({
    secret,
    algorithms: ["HS256"],
    //isRevoked: isRevoked, //for admin
  }).unless({
    path: [
      { url: /\/api\/posts(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
