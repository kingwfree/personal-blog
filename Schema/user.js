const {Schema} = require('./connect');
const UserSchema = new Schema({
    username: String,
    password: String,
    role:{
        type:String,
        default:1
    },
    avatar:{
        type:String,
        default:"/avatar/default.jpg"
    },//头像
    articleNum:Number,
    commentNum:Number
},{versionKey:false});


module.exports = UserSchema