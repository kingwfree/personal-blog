const Article = require('../Models/article');
const Users = require('../Models/user');
const Comment = require('../Models/comment');

//保存评论
exports.save = async ctx=>{

    let message = {
        status:0,
        msg:"登录才能发表"
    }

    //验证用户是否登录
    if(ctx.session.isNew)return ctx.body = message

    //用户已登录
    const data = ctx.request.body;
    data.author = ctx.session.uid;
    /*
        console.log(data);
        {   
            content: 'gggg',
            article: '5ca72d9287a2a51d7c64dd09',
            author: '5ca72d8387a2a51d7c64dd08' 
        }
    */
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

//后台  查询用户所有评论
exports.comlist = async ctx=>{
    const uid = ctx.session.uid;
    const data = await Comment
                            .find({author:uid})
                            .populate('article','title')
                            .then(data=>data);
    //console.log(data);
    /*
        [ { _id: 5ca84807d41733391066dd1f,
            content: 'xxxxxx',
            article: { _id: 5ca84801d41733391066dd1e, title: 'xxx' },
            author: 5ca847f2d41733391066dd1d,
            created: 2019-04-06T06:32:39.464Z,
            updatedAt: 2019-04-06T06:32:39.464Z } ]
    */
    ctx.body = {
        code:0,
        count:data.length,
        data
    }
}

exports.del = async ctx=>{
    //评论 id
    const commentId = ctx.params.id;
    //console.log(commentId);
    //删除 comment 
    //只要是findByIdAnd--这种形式的都不会触发钩子函数 他们是面向数据库的
    //因为这种是直接对数据库操作的，没有经过mongoose这一层
    //钩子函数只有在当前文档下调用方法时才会触发，而model下是不会触发的  
    //钩子函数相当于挂在Schema下的methods方法而不是statics方法
    //Comment.findByIdAndRemove(commentId).exec();
    //Comment.deleteOne({_id:commentId}).exec();

    let res = {
        state:1,
        message:'删除成功'
    }
    await Comment.findById(commentId)
            .then(
                //这里的data就是实例 会触发钩子
                //data=>console.log(data)
                data=>data.remove()
            )
            .catch(err=>{
                res = {
                    state:0,
                    message:err
                }
            })

    ctx.body = res

}