const Router = require('koa-router');
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
const router = new Router

//设计主页
router.get('/',user.keepLog,article.getList)

//:id这部分是动态路由，主要用来用户 登录 注册
// router.get('/user/:id',(ctx)=>{
//     ctx.body = ctx.params.id;
// })
router.get(/^\/user\/(?=reg|login)/,async(ctx)=>{
    //show为true则显示注册 false显示登录
    const show=/reg$/.test(ctx.path)
    await ctx.render("register",{
        show
    })
})

//处理用户登录的post请求
// router.post("/user/login",async(ctx)=>{
//     // console.log('用户需要登录，登录的数据：');
//     // console.log(ctx.request.body)
// })
//用户登录路由
router.post("/user/login",user.login)

//用户注册路由
router.post("/user/reg",user.reg)

//用户退出路由
router.get('/user/logout',user.logout)

//文章的发表页面
router.get("/article",user.keepLog,article.addPage)

//文章添加
router.post('/article',user.keepLog,article.add)

//文章列表分页路由
router.get("/page/:id",article.getList)

//文章详情页
router.get('/article/:id',user.keepLog,article.details)

//发表评论
router.post('/comment',user.keepLog,comment.save)

//文章 评论 头像上传
router.get('/admin/:id',user.keepLog,admin.index)

//404
router.get('*',async ctx=>{
    await ctx.render("404",{
        title:"404"
    })
})

module.exports = router