const Router = require('koa-router');
const user = require('../control/user');
const article = require('../control/article');
const router = new Router

//设计主页
router.get('/',user.keepLog,async(ctx)=>{
    //需要title属性 

    await ctx.render('index',{
        title:"blog",
        session:ctx.session
    })
})

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

module.exports = router