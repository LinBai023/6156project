const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout
router.get('/', checkLogin, function (req, res, next) {
    // when sign out, clear all the sessions
    req.session.user = null
    req.flash('success', 'successfully sign out')
    res.redirect('/posts')
})

module.exports = router