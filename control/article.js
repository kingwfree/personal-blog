const Article = require('../Models/article');
const Users = require('../Models/user');
const Comment = require('../Models/comment');
//返回文章发表页
exports.addPage = async (ctx)=>{
    await ctx.render('add-article',{
        title:"文章发表页",
        session:ctx.session
    })
}   

//文章的发表，保存到数据库
exports.add = async ctx=>{
    if(ctx.session.isNew){
        //没登陆 不需要查询数据库
        return ctx.body={
            msg:"用户未登录",
            status:0
        }
    }
    //用户登录的情况
    //这是用户在登录情况下，post发过来的数据
    const data = ctx.request.body
    // title content tips     author
    // 添加文章作者
    data.author = ctx.session.uid
    data.commentNum = 0;
    await new Promise((resolve,reject)=>{
        new Article(data)
            .save((err,data)=>{
                if(err)return reject(err);
                //用户文章计数 {$inc:{articleNum:1}每提交一次加一
                Users.update({_id:data.author},{$inc:{articleNum:1}},err=>{
                    if(err)return console.log(err);
                })

                resolve(data);
            })
    })
    .then(data=>{
        ctx.body={
            msg:"发表成功",
            status:1
        }
    })
    .catch(err=>{
        ctx.body={
            msg:"发表失败",
            status:0
        }
    })
    


}

//获取文章列表
exports.getList = async ctx=>{
    //获取头像
    //动态路由的id值 ctx.params.id
    let page = ctx.params.id || 1;
    page--;
    //传值 then exec
    // Article
    //     .find(()=>{})
    // Article
    //     .find()
    //     .then(()=>{})
    // Article
    //     .find()
    //     .exec(()=>{})
    
    //查询当前这个集合中有多少条数据
    const maxNum = await Article.estimatedDocumentCount((err,data)=>err?console.log(err):data);

    const artList = await Article
        .find()
        .sort('-created') //-created 根据created降序排序 created 根据created升序排序
        .skip(5*page)
        .limit(5)
        .populate({
            path:'author',
            select:'username _id avatar'
        })   //mongoose用于连表查询
        .then(data=>data)
        .catch(err=>{
            console.log(err);
        })
    //console.log(artList);
     /* 
        [ { _id: 5ca8434fac62a23b28f0da8f,
            tips: 'nodejs',
            title: 'ddd',
            content: 'ddd',
            author:
            { avatar: '/avatar/1554531172507.png',
            _id: 5ca84337ac62a23b28f0da8e,
            username: 'ddd' },
            commentNum: 1,
            created: 2019-04-06T06:12:31.252Z,
            updatedAt: 2019-04-06T06:12:40.916Z } ]
     */
    await ctx.render('index',{
        session:ctx.session,
        title:"blog",
        artList,
        maxNum
    })





}

//文章详情页
exports.details = async ctx=>{
    const _id = ctx.params.id;
    const article = await Article
        .findById(_id)
        .populate('author','username')
        .then(data=>data)
    //console.log(article);

    const comment = await Comment
        .find({article:_id})
        .sort('-created')
        .populate('author','username avatar')
        .then(data=>data)
        .catch(err=>{
            console.log(err);
        })
    //console.log(comment);
    await ctx.render('article',{
        title:article.title,
        article,
        comment,
        session:ctx.session
    })

}

//后台 获取用户的所有文章
exports.articlelist = async ctx=>{
    const uid = ctx.session.uid;
    const data = await Article
                            .find({author:uid});
    ctx.body = {
        code:0,
        count:data.length,
        data
    }
}

//后台 删除用户文章
exports.del = async ctx=>{
    const articleId = ctx.params.id;
    let res = {
        state:1,
        message:'删除成功'
    };
    await Article.findById(articleId)
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
    ctx.body = res;
}