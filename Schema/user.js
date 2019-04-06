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

UserSchema.post('remove',document=>{
    const Article = require('../Models/article');
    const Comment = require('../Models/comment');

    const {_id} = document;

    //删除所有文章
    Article
        .find({author:_id})
        .then(data=>data.forEach(item=>item.remove()))
    Comment
        .find({author:_id})
        .then(data=>data.forEach(item=>item.remove()))
})

module.exports = UserSchema