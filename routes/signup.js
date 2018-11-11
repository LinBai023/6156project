const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const fs = require('fs')
const path = require('path')

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signup')
})

// POST /signup
router.post('/', checkNotLogin, function (req, res, next) {
    const name = req.fields.name
    const gender = req.fields.gender
    const bio = req.fields.bio
    let password = req.fields.password
    const repassword = req.fields.password
    //exam the validation of information
    try{
        if(!(name.length>=1 && name.length <=30)){
            throw new Error('not valid')
        }
        if(password!==repassword) {
            throw new Error('no valid password')
        }
    }
    catch(e){
        req.flash('error',e.message)
        return res.redirect('/signup')
    }

    //encrypt the password
    password = sha1(password)

    // write the data into database
    let user = {
        name: name,
        password: password,
        gender:gender,
        bio:bio
    }
    UserModel.create(user)
        .then(function(result){
            user = result.ops[0]
            //delete the password information, write into the session part???
            delete user.password
            req.session.user = user
            // write into flask
            req.flash('success', 'successfully sign up!')
            res.redirect('/posts')
        })
        .catch(function(e) {
            if(e.message.match('duplicate key')){
                req.flash('error','already in use')
                return res.redirect('/signup')
            }
            next(e)
        })

})

module.exports = router