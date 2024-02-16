const jwt = require("jsonwebtoken");

const verifytoken = (token) => {

    return decodedToken = jwt.verify(token, process.env.SECRET)
    
}
module.exports = verifytoken;