const jwt = require("jsonwebtoken");

const config = process.env;

module.exports= function (req, res, next) {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send("Token gerekli..");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Gecersiz token..");
  }
  return next();
}

