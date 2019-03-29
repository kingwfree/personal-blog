const Koa = require('koa'),
      static = require('koa-static'),
      views = require('koa-views');
const logger = require('koa-logger');
const router = require('./routers/router');
const {join} = require('path');
const body = require('koa-body');
const session = require('koa-session');
//生成koa实例
const app = new Koa;

//注册日志模块
app.use(logger())

app.keys=['zzyngsb'];

//session的配置对象
//maxAge   ms
//rolling:true 每登录一次就刷新一次过期时间
const config = {
    key:"sid",
    maxAge:36e5,
    overwrite:true,
    httpOnly:true,
    signed:true,
    rolling:true //每登录一次就刷新一次过期时间
}

//注册session
app.use(session(config,app))

//配置koa-body处理post请求数据
app.use(body())

//配置静态资源目录
app.use(static(join(__dirname,'public')))

//配置视图模板
app.use(views(join(__dirname,'views'),{
    extension:'pug'
}))

//注册路由信息
app.use(router.routes())
    .use(router.allowedMethods())

app.listen(3000,()=>{
    console.log('项目启动成功，监听在3000端口');
})