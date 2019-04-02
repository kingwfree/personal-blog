const {db} = require('../Schema/connect');
const ArticleSchema = require('../Schema/article');
const CommentSchema = require('../Schema/comment');
//取用户的Schema，为了拿到操作 users 集合的实例对象
const UserSchema = require('../Schema/user');

//通过db对象创建操作blogproject数据库下的articles集合的模型对象
const Article = db.model('articles',ArticleSchema);
const Users = db.model('users',UserSchema);
const Comment = db.model('comments',CommentSchema);
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
                //用户文章计数
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