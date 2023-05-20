const jwt = require('jsonwebtoken')

function user(req){
    const token = req.headers['x-access-token'] || '';
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)
    return tokenDecoded;
}

module.exports = { user }