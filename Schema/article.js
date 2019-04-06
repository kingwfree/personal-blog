const {Schema} = require('./connect');
const ObjectId = Schema.Types.ObjectId;


const ArticleSchema = new Schema({
    title:String,
    content:String,
    author:{
        type:ObjectId,
        ref:"users"
    },//关联 users 的表
    tips:String,
    commentNum:Number
},{
    versionKey:false,
    timestamps:{
        createdAt:"created"
    }
});

ArticleSchema.post('remove',document=>{
    const Comment = require('../Models/comment');
    const Users = require('../Models/user');

    const {_id,author} = document;
    //只需要用户的articleNum -1
    //.updateOne({_id:author},{$inc:{articleNum:-1}})
    Users
        .findByIdAndUpdate(author,{$inc:{articleNum:-1}})
        .exec()

    Comment
        .find({article:_id})
        .then(data=>{
            data.forEach(v=>v.remove())
        })

})

module.exports = ArticleSchema