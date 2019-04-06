//链接数据库 导出db Schema
const mongoose = require('mongoose');

/*  
    mongoose.createConnection此方法获取数据库连接，操作database层面，返回一个Connection对象。
    Connection对象中包含model，collection，dropDatabase等操作数据库的方法，
    也包含connected，disconnected，error等事件触发方法。
    
    connect你永远操作的是require出来的mongoose 实例
    在createConnection中你操作的是createConnection返回的mongoose新实例

    mongoose支持的基本类型有:
        String
        Number
        Date
        Buffer
        Boolean
        Mixed
        ObjectId
        Array
*/
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