const Post = require('../lib/mongo').Post
const marked = require('marked')


// translate markdown to html
Post.plugin('contentToHtml',{
    afterFind: function(posts) {
        return posts.map(function (post) {
            post.content = marked(post.content)
            return post
        })
    },
    afterFindOne: function(post) {
        if(post){
            post.content = marked(post.content)
        }
        return post
    }
})
module.exports = {
    create: function create(post){
        return Post.create(post).exec()
    },

    // from postID to find a post article
    getPostById: function getPostById(postId){
        return Post
            .findOne({ _id:postId })
            .populate({ path: 'author', model: 'User'})
            .addCreatedAt()
            .contentToHtml()
            .exec()
    },

    //get article by time for one author
    getPosts: function getPosts(author){
        const query = {}
        if(author){
            query.author = author
        }
        return Post
            .find(query)
            .populate({ path:'author', model: 'User'})
            .sort({ _id:-1 })
            .addCreatedAt()
            .contentToHtml()
            .exec()
    },

    incpv: function incpv(postId){
        return Post
            .update({_id: postId}, {$inc: {pv:1}})
            .exec()
    },

    getRawPostById: function getRawPostById(postId){
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User' })
            .exec()
    },

    updatePostById: function updatePostById(postId, data){
        return Post.update({_id: postId}, { $set:data}).exec()
    },

    delpostById: function delPostById(postId) {
        return Post.delete({_id: postId}).exec()
    }
}