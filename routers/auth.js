var express = require('express');
var passport = require('passport');

var router = express.Router();
module.exports = router;

router.get('/', isLoggedIn, function(req, res) {
    res.render('index', {
        message: req.flash('message')
    });
});

router.post('/', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/'
}));

router.get('/register', isLoggedIn, function(req, res) {
    res.render('register', {
        message: req.flash('message')
    });
});

router.post('/register', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/register'
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.user && req.session) {
        res.redirect('/home');
        return;
    }
    return next();
}
