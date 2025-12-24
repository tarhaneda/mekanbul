var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        User.findOne({ email: username })
            .then(function (user) {
                if (!user) {
                    return done(null, false, { message: 'Hatalı kullanıcı adı.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Hatalı şifre.' });
                }
                return done(null, user);
            })
            .catch(function (err) {
                return done(err);
            });
    }
));
