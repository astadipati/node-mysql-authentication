var express = require('express');

var router = express.Router();
module.exports = router;

router.get('/home', function(req, res) {
    res.render('home', {
        user: req.user.username
    });
});
