var express = require('express');
var passport = require('passport');

var router = express.Router();
module.exports = router;

router.get('/', function(req, res) {
    if (req.user) {
        res.redirect('/home');
    } else {
        res.render('index', {
            message: req.flash('message')
        });
    }
});

router.post('/', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/'
}));

router.get('/register', function(req, res) {
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

router.get('/home', function(req, res) {
    res.render('home', {
        message: req.flash('message')
    });
});
