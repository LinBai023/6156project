const express = require('express')
const router = express.Router()
const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const sha1 = require('sha1')

// GET /signin
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')
})

// POST /signin
router.post('/', checkNotLogin, function (req, res, next) {
    const name= req.fields.name
    const password = req.fields.password
    try{
        if(!password.length){
            throw('please write password')
        }
        if(!name.length){
            throe('please write name')
        }
    }
    catch(e){
        req.flash('error', e.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(name)
        .then(function(user){
            if(!user){
                req.flash('error','not exists')
                return res.redirect('back')
            }
            if(sha1(password)!==user.password){
                req.flash('error', 'error')
                return res.redirect('back')
            }
            req.flash('sucess', 'successfully sign in')

            delete user.password
            req.session.user = user
            res.redirect('/posts')
        })
        .catch(next)
})

module.exports = router