const {Schema} = require('./connect');
const ObjectId = Schema.Types.ObjectId;


const CommentSchema = new Schema({
    //头像 用户 评论内容
    content:String,
    author:{
        type:ObjectId,
        ref:"users"
    },//关联到集合 users
    article:{
        type:ObjectId,
        ref:'articles'
    },//关联到集合 articles
},{
    versionKey:false,
    timestamps:{
        createdAt:"created"
    }
});



module.exports = CommentSchema