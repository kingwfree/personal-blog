const fs = require('fs');
const {join} = require('path');
const {db} = require('../Schema/connect');
const CommentSchema = require('../Schema/comment');
const ArticleSchema = require('../Schema/article');
//取用户的Schema，为了拿到操作 users 集合的实例对象
const UserSchema = require('../Schema/user');

//通过db对象创建操作blogproject数据库下的articles集合的模型对象
const Article = db.model('articles',ArticleSchema);
const Users = db.model('users',UserSchema);
const Comment = db.model('comments',CommentSchema);

exports.index = async ctx=>{
    if(ctx.session.isNew){

        //没有登录
        ctx.status = 404;
        return await ctx.render('404',{
            title:'404'
        })
    }
    const id = ctx.params.id;

    const arr = fs.readdirSync(join(__dirname,'../views/admin'))
    //console.log(arr);
    let flag = false;
    arr.forEach(item=>{
        const name = item.replace(/^(admin\-)|(\.pug)$/g,"");
        if(name === id){
            flag=true;
        }
    })
    if(flag){
        await ctx.render('./admin/admin-'+id,{
            role: ctx.session.role
        })
    }else{
        ctx.status = 404
        await ctx.render('404',{
            title:'404'
        })
    }

}