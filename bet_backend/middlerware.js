require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;
const Verifytoken = (req, resp, next) => {
    let tok = req.headers['authorization'];
    if (tok) {
        jwt.verify(tok,JWT_KEY, (err, valid) => {
            if (err) {
                resp.send("Please add token valid");
            }
            else {
                next();
            }
        })
    }
    else {
        resp.send("Please add token");
    }
}

module.exports={Verifytoken}