const crypto = require("crypto");

// Hash password:
function hash(password){
    const hashPassword = crypto.createHash("sha1").update(password).digest("hex");
    return hashPassword;
}

module.exports = hash;