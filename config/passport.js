var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var DB = require('./mysql');

var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
}

var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


passport.serializeUser(function(user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function(userId, done) {
    DB.query("SELECT * FROM users WHERE userId = ? ", [userId], function(err, user) {
        done(err, user[0]);
    });
});

passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        DB.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
            if (err) return done(err);

            if (!rows.length) {
                return done(null, false, req.flash('message', 'User not registered'));
            }

            if (!bCrypt.compareSync(password, rows[0].password)) {
                return done(null, false, req.flash('message', 'Invalid Credentials'));
            }

            return done(null, rows[0]);
        });
    }));

passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {

        DB.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('message', 'User Already Exists'));
                } else {
                    var user = {
                        username: username,
                        password: bCrypt.hashSync(password, null, null)
                    };

                    var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                    DB.query(insertQuery,[user.username, user.password],function(err, rows) {
                        user.userId = rows.insertId;
                        return done(null, false, req.flash('message', 'New User Created'));
                    });
                }
            });
    }));
