const bcrypt = require('bcryptjs');

module.exports.hashString = async (round, password)=>{
    const salt = await bcrypt.genSalt(round);
    return await bcrypt.hash(password,salt);
}