const jwt = require('jsonwebtoken');
// Need to npm install jsonwebtoken in app/project (otherwise it won't show up in package.json/package-lock.json)
// https://github.com/auth0/node-jsonwebtoken#readme

// In a real project this wouldn't be saved here, but for educational purposes we are
// This provides the salt for the encryption algorithm:
const TOKEN_KEY = "w;oier#0u3219jfewofY(*&TO*EArr*&new08thwe";

module.exports.createToken = function(identifier) {
  // Syntax: jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const token = jwt.sign( //creates
    {user_id: identifier},
    TOKEN_KEY,
    //{expiresIn: '10hr'}, //example; expiresIn not used in this project. 
  )
  // console.log("TOKEN: ", token); //used to test
  return token;
}

// module.exports.verifyToken = function(token) {
//   // Syntax: jwt.verify(token, secretOrPublicKey, [options, callback])
//   const decoded = jwt.verify(token, TOKEN_KEY); //decodes
//   // console.log("DECODED: ", decoded); // used to test
//   return decoded;
// }

// Changing .verifyToken to extract token from request:
module.exports.verifyToken = function(req, res, next) {
  // Using || in assignment: first value found is assigned to 'token':
  const token = req.body.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required.")
  }

  try {
    // If a callback is not supplied, function acts synchronously. Returns payload decoded if the signature is valid and option expiration, audience, or issuer are valid. If not; it will throw error.
    const decoded = jwt.verify(token, TOKEN_KEY);
    console.log("DECODED: ", decoded);
    req.user_id = decoded.user_id;
  } catch (err) {
    return res.status(401).send("Invalid token.");
  }

  return next();
}