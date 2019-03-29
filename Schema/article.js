const {Schema} = require('./connect');
const ArticleSchema = new Schema({
    title:String,
    content:String,
    author:String
},{versionKey:false});


module.exports = ArticleSchema