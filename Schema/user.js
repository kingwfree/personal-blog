const {Schema} = require('./connect');
const UserSchema = new Schema({
    username: String,
    password: String,
    avatar:{
        type:String,
        default:"/avatar/default.jpg"
    }//头像
},{versionKey:false});


module.exports = UserSchema