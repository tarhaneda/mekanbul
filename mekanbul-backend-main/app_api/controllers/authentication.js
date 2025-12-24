var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var register = async function (req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, { "message": "Tüm alanlar gerekli" });
        return;
    }
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role || 'user';
    user.setPassword(req.body.password);

    try {
        await user.save();
        var token = user.generateJwt();
        sendJSONResponse(res, 200, {
            "token": token,
            "role": user.role,
            "name": user.name
        });
    } catch (err) {
        sendJSONResponse(res, 400, {
            "message": "Kayıt başarısız",
            "error": {
                "name": err.name,
                "code": err.code,
                "message": err.message,
                "errmsg": err.errmsg
            }
        });
    }
};

var login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, { "message": "Tüm alanlar gerekli" });
        return;
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        if (user) {
            var token = user.generateJwt();
            sendJSONResponse(res, 200, {
                "token": token,
                "role": user.role,
                "name": user.name
            });
        } else {
            sendJSONResponse(res, 401, info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};
