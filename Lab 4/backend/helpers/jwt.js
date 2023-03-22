const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  return jwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: "/api/post", methods: ["GET", "OPTIONS"] },
      "/api/users/login",
      "/api/users/register",
    ],
  });
}
module.exports = authJwt;
