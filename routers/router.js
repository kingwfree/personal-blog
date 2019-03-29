const Router = require('koa-router');
const user = require('../control/user');
const router = new Router

//设计主页
router.get('/',async(ctx)=>{
    //需要title属性 
    await ctx.render('index',{
        session:{
            role:666
        }
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
router.post("/user/login",user.login)

router.post("/user/reg",user.reg)
module.exports = router