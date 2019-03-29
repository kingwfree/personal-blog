const {db} = require('../Schema/connect');
const ArticleSchema = require('../Schema/article');

//通过db对象创建操作blogproject数据库下的articles集合的模型对象
const Article = db.model('articles',ArticleSchema);

//添加文章
exports.addPage = async (ctx)=>{
    await ctx.render('add-article',{
        title:"文章发表页",
        session:ctx.session
    })
}   
