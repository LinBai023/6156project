module.exports = {

// check log in: req.session.user not exists

    checkLogin: function checkLogin (req, res, next) {
        if (!req.session.user) {
            req.flash('error', 'Not Log in')
            return res.redirect('/signin')
        }
        next()
    },

// checkNotLogin: req.session.user already exists

    checkNotLogin: function checkNotLogin (req, res, next) {
        if (req.session.user) {
            req.flash('error', 'Already log in')
            return res.redirect('back')// 返回之前的页面
        }
        next()
    }
}