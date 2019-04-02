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



module.exports = ArticleSchema