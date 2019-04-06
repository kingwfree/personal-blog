const userSchema = require('../Schema/user');
const {db} = require('../Schema/connect');

const Users = db.model('users',userSchema);

module.exports = Users