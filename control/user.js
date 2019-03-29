const {db} = require('../Schema/connect');
const UserSchema = require('../Schema/user');
const encrypt = require('../utils/crypt');
//通过db对象创建操作users数据库的模型对象
const Users = db.model('users',UserSchema);

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
                password:encrypt(password)
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