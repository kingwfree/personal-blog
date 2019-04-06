const commentSchema = require('../Schema/comment');
const {db} = require('../Schema/connect');

const Comment = db.model('comments',commentSchema);

module.exports = Comment