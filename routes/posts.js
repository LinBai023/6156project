const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')
const checkLogin = require('../middlewares/check').checkLogin

// GET /posts?author=xxx ==> articles of specific autor

router.get('/', function (req, res, next) {
    const author = req.query.author

    PostModel.getPosts(author)
        .then(function(posts){
            res.render('posts',{
                posts:posts
            })
        })
        .catch(next)
})

// POST /posts/create ==> create an article
router.post('/create', checkLogin, function (req, res, next) {
    const author= req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    try{
        if(!title.length){
            throw new Error('Please fill in title')
        }
        if(!content.length){
            throw new Error('please fill in content')
        }
    }
    catch(e){
        req.flash('error', e.message)
        return res.redirect('back')
    }
    let post = {
        author: author,
        title: title,
        content:content
    }
    PostModel.create(post)
        .then(function(result){
            post = result.ops[0]
            req.flash('success', 'successfully publish')
            res.redirect('/posts/${post._id}')
        })
        .catch(next)
})

// GET /posts/create ===> post a new article
router.get('/create', checkLogin, function (req, res, next) {
    res.render('create')
})

// GET /posts/:postId ==> one specific article
router.get('/:postId', function (req, res, next) {
    const postId = req.params.postId

    Promise.all([
        PostModel.getPostById(postId),
        PostModel.incpv(postId)
    ])
        .then(function(result){
        const post = result[0]
        if(!postId){
            throw ('not exitst!')
        }

        res.render('post',{
            post:post
        })
    })
    .catch(next)
})

// GET /posts/:postId/edit ==>update article
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId)
        .then(function (post){
            if(!post){
                throw new Error('not exists')
            }
            if(author.toString() !== post.author.user._id.toString()){
                throw new Error('not allowed!')
            }
            res.render('edit', {
                post:post
            })
        }).catch(next)
})

// POST /posts/:postId/edit ==> update
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId
    const author = req.session.user_id
    const title = req.fields.title

    try{
        if(!title.length){
            throw new Error("please fill in title")
        }
        if(!content.length){
            throw new Error("please fill in content")
        }
    }
    catch(e){
        req.flash('error', e.message)
        return res.redirect('back')
    }

    PostModel.getRawPostById(postId)
        .then(function (post){
            if(!post){
                throw new Error("not exists")
            }
            if(post.author_id.toString()!== author.toString()){
                throw new Error("not allow!")
            }
            PostModel.updatePostById(postId, {title:title, content:content })
                .then(function(){
                    req.flash('success', 'successfully edit')
                    res.redirect('/post/${postId}')
                })
                .catch(next)
        })
})

// GET /posts/:postId/remove delete
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    const postId = req.params.postId
    const author = req.session.user_id

    PostModel.getRawPostById(postId)
        .then(function(post){
            if(!postId){
                throw new Error('not exists')
            }
            if(post.author_id.toString()!== author.toString()){
                throw new Error("not allow!")
            }
            PostModel.delpostById(postId)
                .then(function(){
                    req.flash('success','successfully delete')
                    res.redirect('/posts')
                })
                .catch(next)
        })
})

module.exports = router