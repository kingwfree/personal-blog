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
    const fs = require('fs');
    const {join} = require('path');

    const {_id,avatar} = document;

    //删除所有文章与本文章对应的评论
    Article
        .find({author:_id})
        .then(data=>data.forEach(item=>item.remove()))
    //删除该用户所有评论
    Comment
        .find({author:_id})
        .then(data=>data.forEach(item=>item.remove()))
    //删除用户头像
    //console.log(join(__dirname,"../public"+avatar))
    if("/avatar/default.jpg" !== avatar){
        fs.unlinkSync(join(__dirname,"../public"+avatar))
    }
    
})

module.exports = UserSchema