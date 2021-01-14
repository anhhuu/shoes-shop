const roleMongooseModel = require('../mongooseModels/roleMongooseModel');

exports.getRoleByName = (roleName) => {
    return roleMongooseModel.findOne({
        name: roleName
    }).lean();

}