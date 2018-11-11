const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments ==> create comments
router.post('/', checkLogin, function (req, res, next) {
    res.send('create comments')
})

// GET /comments/:commentId/remove ==> delete comments
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
    res.send('delete comments')
})

module.exports = router