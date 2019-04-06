const Users = require('../Models/user');
const encrypt = require('../utils/crypt');
const fs = require('fs');
const {join} = require('path');
//用户注册
exports.reg = async ( ctx )=>{
    // console.log('用户需要注册，注册的数据：');
    // console.log(ctx.request.body);
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    //注册时应该干嘛
    //1、去数据库users 先查询当前发过来的username 是否存在
    //2、
    await new Promise((resolve,reject)=>{
        //去数据库users 查询
        Users.find({username},(err,data)=>{
            // console.log(err);
            // console.log(data);

            //数据库查询是否出错
            if(err)return reject(err)

            //数据库里是否存在这个用户名
            if(data.length !== 0){
                //用户名已存在
                return resolve('')
            }

            //用户名还未被注册 不存在 要存到数据库
            //保存到数据库之前要先加密，encrypt模块是自定义加密模块
            const _user = new Users({
                username,
                password:encrypt(password),
                commentNum:0,
                articleNum:0
            })
            _user.save((err,data)=>{
                if(err)return reject(err);
                resolve(data);
            })
        })
    })

    .then(async data=>{
        if(data){
            //注册成功
            await ctx.render('isOk',{
                status:"注册成功"
            })
        }else{
            //用户名已存在
            await ctx.render('isOk',{
                status:"用户名已存在"
            })
        }
    })
    .catch(async err=>{
        await ctx.render('isOk',{
            status:"注册失败请重试"
        })
    })


}

//用户登录
exports.login = async (ctx)=>{
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;

    await new Promise((resolve,reject)=>{
        Users.find({username},(err,data)=>{
            if(err)return reject(err);
            if(data ===0)return reject("用户名不存在")
            //console.log(data);
            //把用户传过来的密码加密后与数据库的密码比较
            if(data[0].password === encrypt(password))
                return resolve(data)
            resolve('')
        })
    })
    .then(async data=>{
        if(!data)return ctx.render("isOk",{
            status:"密码不正确，登录失败"
        })

        //让用户在他的cookie里设置username password加密后的密码 权限
        //cookies的signed默认true
        ctx.cookies.set('username',username,{
            domain:"localhost", //挂载的主机名
            path:'/', //在当前主机的什么路径下cookie里的值可以访问到
            maxAge:36e5,
            httpOnly:true,//不让客户端访问这条cookie
            overwrite:false,
            //signed:false
        })
        ctx.cookies.set('uid',data[0]._id,{
            domain:"localhost", //挂载的主机名 / 域名
            path:'/', //在当前主机的什么路径下cookie里的值可以访问到
            maxAge:36e5,
            httpOnly:true,//不让客户端访问这条cookie
            overwrite:false,
            //signed:false
        })
        
        ctx.session = {
            username,
            uid:data[0]._id,
            avatar:data[0].avatar,
            role:data[0].role
        }
        //登录成功
        await ctx.render('isOk',{
            status:"登录成功"
        })
    })
    .catch(async err=>{
        await ctx.render('isOk',{
            status:"登录失败"
        })
    })
}

//保持用户状态
exports.keepLog = async (ctx,next)=>{
    const uid = ctx.cookies.get("uid");
    //确认当前的session对象是不是全新对象
    if(ctx.session.isNew){//session没有
        if(uid){
            const data = await Users
                                    .findById(uid)
                                    .then(data=>data)
            
            ctx.session={
                username:ctx.cookies.get('username'),
                uid,
                avatar:data.avatar,
                role:data.role

            }
        }
    }else{
        const data = await Users
                                .findById(uid)
                                .then(data=>data)
            ctx.session={
                username:ctx.cookies.get('username'),
                uid,
                avatar:data.avatar,
                role:data.role
            }
    }
    await next();
}

//用户退出
exports.logout = ctx=>{
    ctx.session = null;
    ctx.cookies.set("username",null,{
        maxAge:0
    });
    ctx.cookies.set("uid",null,{
        maxAge:0
    });
    //重定向到 根
    ctx.redirect("/");
}

//用户头像上传
exports.upload = async ctx=>{
    //console.log(ctx.req.file);
    const filename = ctx.req.file.filename;
    let data = {};
    const uArr = await Users.find({_id:ctx.session.uid})
    //console.log(uArr[0].avatar);
    //console.log("/avatar/default.jpg" === uArr[0].avatar)
    if("/avatar/default.jpg" !== uArr[0].avatar){
        fs.unlinkSync(join(__dirname,"../public"+uArr[0].avatar))
    }
    await Users.updateOne({_id:ctx.session.uid},{$set:{avatar:'/avatar/'+filename}},(err,res)=>{
        if(err){
            data={
                status:0,
                message:'上传失败'
            }
        }else{
            data={
                status:1,
                message:'上传成功'
            }
        }
    })
    ctx.body = data;

}

//后台 获取所有用户
exports.userlist = async ctx =>{
    const data = await Users.find();
    ctx.body = {
        code:0,
        data
    }
}

//后台 删除用户
exports.del = async ctx=>{
    const _id = ctx.params.id;
    //console.log(_id);
    let res={
        state:1,
        message:'删除成功'
    };
    await Users
            .findById(_id)
            .then(data=>data.remove())
            .catch(err=>{
                res={
                    state:0,
                    message:err
                }
            })
    ctx.body = res;
    
}