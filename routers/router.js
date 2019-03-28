const Router = require('koa-router');

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

module.exports = router