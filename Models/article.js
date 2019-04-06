const ArticleSchema = require('../Schema/article');
const {db} = require('../Schema/connect');

const Article = db.model('articles',ArticleSchema);

module.exports = Article