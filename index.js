var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
require('./config/passport');

var app = express();
var sessionTimeout = 60 * 60 * 1000; // 1 Hour
var sessionConfig = {
    secret: 'secret code',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
}

app.set('port', process.env.PORT || 3000);
app.set('views', './views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(require('./routers/auth'));

app.use(function(req, res, next) {
    if (req.user) {
        if (req.session.lastView) {
            if (req.session.lastView + sessionTimeout < Date.now()) {
                req.logout();
                req.session.destroy();
                res.redirect('/');
                return;
            } else {
                req.session.lastView = Date.now();
            }
        } else {
            req.session.lastView = Date.now();
        }

        next();
        return;
    }
    res.redirect('/');
});

app.use(require('./routers/home'));

app.listen(app.get('port'), function(err) {
    if (err) throw err;
    console.log('Listening at http://localhost:' + app.get('port'));
});
