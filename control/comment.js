const {db} = require('../Schema/connect');
const CommentSchema = require('../Schema/comment');
const ArticleSchema = require('../Schema/article');
//取用户的Schema，为了拿到操作 users 集合的实例对象
const UserSchema = require('../Schema/user');

//通过db对象创建操作blogproject数据库下的articles集合的模型对象
const Article = db.model('articles',ArticleSchema);
const Users = db.model('users',UserSchema);
const Comment = db.model('comments',CommentSchema);

exports.save = async ctx=>{

    let message = {
        status:0,
        msg:"登录才能发表"
    }

    //验证用户是否登录
    if(ctx.session.isNew)return ctx.body = message

    //用户登录
    const data = ctx.request.body;
    data.author = ctx.session.uid;
    const _comment = new Comment(data);

    await _comment
        .save()
        .then(data=>{
            message={
                status:1,
                msg:'评论成功'
            }

            //更新当前文章的评论计数器
            Article
                .update({_id:data.article},{$inc:{commentNum:1}},err=>{
                    if(err)return console.log(err);
                    console.log('更新成功')
                })
                
            //更新用户的评论计数器
            Users.update({_id:data.author},{$inc:{commentNum:1}},err=>{
                if(err)return console.log(err);
            })

        })
        
        .catch(err=>{
            message = {
                status:0,
                msg:err
            }
        })
    ctx.body = message
}