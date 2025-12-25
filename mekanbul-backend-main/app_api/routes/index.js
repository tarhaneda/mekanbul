var express = require('express');
var router = express.Router();
var ctrlMekanlar = require("../controllers/mekanlar");
var ctrlYorumlar = require("../controllers/yorumlar");
var ctrlAuth = require("../controllers/authentication");
var jwt = require('jsonwebtoken');


var authenticate = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

var isAdmin = function (req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
};

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


router
    .route("/admin/mekanlar")
    .get(authenticate, isAdmin, ctrlMekanlar.adminMekanlariListele);


router
    .route("/mekanlar")
    .get(ctrlMekanlar.mekanlariListele)
   
    .post(authenticate, isAdmin, ctrlMekanlar.mekanEkle);

router
    .route("/mekanlar/:mekanid")
    .get(ctrlMekanlar.mekanGetir)
    
    .put(authenticate, isAdmin, ctrlMekanlar.mekanGuncelle)
    .delete(authenticate, isAdmin, ctrlMekanlar.mekanSil);

router
    .route("/mekanlar/:mekanid/yorumlar")
    .post(authenticate, ctrlYorumlar.yorumEkle); 

router
    .route("/mekanlar/:mekanid/yorumlar/:yorumid")
    .get(ctrlYorumlar.yorumGetir)
    .put(authenticate, ctrlYorumlar.yorumGuncelle)
    .delete(authenticate, ctrlYorumlar.yorumSil);

module.exports = router;