//链接数据库 导出db Schema
const mongoose = require('mongoose');
const db = mongoose.createConnection('mongodb://localhost:27017/blogproject',{
    useNewUrlParser:true
});
//用原生es6的promise代替mongoose自实现的promise
mongoose.Promise = global.Promise;

//把mongoose的schema取出来
const Schema = mongoose.Schema

db.on('err',()=>{
    console.log('连接数据库失败');
})
db.on('open',()=>{
    console.log('blogproject数据库连接成功');
})

module.exports = {
    db,
    Schema
}