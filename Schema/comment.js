const {Schema} = require('./connect');
const ObjectId = Schema.Types.ObjectId;


const CommentSchema = new Schema({
    //头像 用户 评论内容
    content:String,
    author:{
        type:ObjectId,
        ref:'users'
    },
    article:{
        type:ObjectId,
        ref:'articles'
    },
},{
    versionKey:false,
    timestamps:{
        createdAt:"created"
    }
});

//设置 comment 的 remove 钩子 
//前置钩子 CommentSchema.pre 通过next将中间件串联起来
//后置钩子 CommentSchema.post   没有next参数，有document即当前的文档对象
CommentSchema.pre("remove",function(){
    //this指向当前的document 这里不能用箭头函数-》this指向的是上下文
})
CommentSchema.post('remove',(document)=>{
    //当前这个回调函数 一定会在remove 事件执行时触发
    //console.log(document)
    //这里的Article和Users不要放外面，有可能会影响到mongoose的model操作
    const Article = require('../Models/article');
    const Users = require("../Models/user");

    const {author,article} = document;

    //对应文章的评论数 -1
    Article
        .updateOne({_id:article},{$inc:{commentNum:-1}})
        .exec()
    
    //当前被删除评论的作者的commentNum -1
    Users
        .update({_id:author},{$inc:{commentNum:-1}})
        .exec()


})

module.exports = CommentSchema