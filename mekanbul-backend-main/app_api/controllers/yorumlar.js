var mongoose = require('mongoose');
var Mekan = mongoose.model('venue');
var User = mongoose.model('User');

var cevapOlustur = function (res, status, content) {
    res.status(status).json(content);
};

const getUser = function (req, res, callback) {
    if (req.user && req.user.email) {
        User
            .findOne({ email: req.user.email })
            .then(user => {
                if (!user) {
                    cevapOlustur(res, 404, { "mesaj": "Kullanıcı bulunamadı" });
                } else {
                    callback(req, res, user.name);
                }
            })
            .catch(err => {
                cevapOlustur(res, 404, err);
            });
    } else {
        cevapOlustur(res, 404, { "mesaj": "Kullanıcı bulunamadı" });
    }
};

var doAddYorum = async function (req, res, mekan, author) {
    if (!mekan) {
        cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
    } else {
        mekan.comments.push({
            author: author,
            rating: parseInt(req.body.rating, 10),
            text: req.body.text
        });

        if (mekan.comments && mekan.comments.length > 0) {
            const totalRating = mekan.comments.reduce((acc, comment) => acc + comment.rating, 0);
            mekan.rating = totalRating / mekan.comments.length; 
            mekan.rating = parseFloat(mekan.rating.toFixed(1));
        }

        try {
            const savedMekan = await mekan.save();
            var thisYorum = savedMekan.comments[savedMekan.comments.length - 1];
            cevapOlustur(res, 201, thisYorum);
        } catch (err) {
            cevapOlustur(res, 400, err);
        }
    }
};

var yorumEkle = async function (req, res) {
    var mekanid = req.params.mekanid;
    if (mekanid) {
        getUser(req, res, async (req, res, author) => {
            try {
                const mekan = await Mekan.findById(mekanid).select('comments').exec();
                await doAddYorum(req, res, mekan, author);
            } catch (err) {
                cevapOlustur(res, 400, err);
            }
        });
    } else {
        cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
    }
};

var yorumGetir = async function (req, res) {
    if (req.params && req.params.mekanid && req.params.yorumid) {
        try {
            const mekan = await Mekan.findById(req.params.mekanid).select('name comments').exec();
            if (!mekan) {
                cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
                return;
            }

            if (mekan.comments && mekan.comments.length > 0) {
                const yorum = mekan.comments.id(req.params.yorumid);
                if (!yorum) {
                    cevapOlustur(res, 404, { "mesaj": "Yorum bulunamadı" });
                } else {
                    const response = {
                        mekan: {
                            name: mekan.name,
                            id: req.params.mekanid
                        },
                        yorum: yorum
                    };
                    cevapOlustur(res, 200, response);
                }
            } else {
                cevapOlustur(res, 404, { "mesaj": "Yorum bulunamadı" });
            }
        } catch (err) {
            cevapOlustur(res, 400, err);
        }
    } else {
        cevapOlustur(res, 404, { "mesaj": "Mekan ID ve Yorum ID gerekli" });
    }
};

var yorumGuncelle = async function (req, res) {
    if (!req.params.mekanid || !req.params.yorumid) {
        cevapOlustur(res, 404, { "mesaj": "Mekan ID ve Yorum ID gerekli" });
        return;
    }
    try {
        const mekan = await Mekan.findById(req.params.mekanid).exec(); 

        if (!mekan) {
            cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
            return;
        }

        if (mekan.comments && mekan.comments.length > 0) {
            const thisYorum = mekan.comments.id(req.params.yorumid);
            if (!thisYorum) {
                cevapOlustur(res, 404, { "mesaj": "Yorum bulunamadı" });
            } else {
                thisYorum.author = req.body.author;
                thisYorum.rating = req.body.rating;
                thisYorum.text = req.body.text;

                try {
                    const savedMekan = await mekan.save();
                    const updatedYorum = savedMekan.comments.id(req.params.yorumid);
                    cevapOlustur(res, 200, updatedYorum);
                } catch (err) {
                    cevapOlustur(res, 404, err);
                }
            }
        } else {
            cevapOlustur(res, 404, { "mesaj": "Güncellenecek yorum yok" });
        }
    } catch (err) {
        cevapOlustur(res, 400, err);
    }
};

var yorumSil = async function (req, res) {
    if (!req.params.mekanid || !req.params.yorumid) {
        cevapOlustur(res, 404, { "mesaj": "Mekan ID ve Yorum ID gerekli" });
        return;
    }
    try {
        const mekan = await Mekan.findById(req.params.mekanid).select('comments').exec();
        if (!mekan) {
            cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
            return;
        }

        if (mekan.comments && mekan.comments.length > 0) {
           
            const yorum = mekan.comments.id(req.params.yorumid);
            if (!yorum) {
                cevapOlustur(res, 404, { "mesaj": "Yorum bulunamadı" });
            } else {
                mekan.comments.pull(req.params.yorumid);
                try {
                    await mekan.save();
                    cevapOlustur(res, 200, { "status": "success", "mesaj": "Yorum başarıyla silindi" });
                } catch (err) {
                    cevapOlustur(res, 404, err);
                }
            }
        } else {
            cevapOlustur(res, 404, { "mesaj": "Silinecek yorum yok" });
        }
    } catch (err) {
        cevapOlustur(res, 400, err);
    }
};

module.exports = {
    yorumEkle,
    yorumGetir,
    yorumGuncelle,
    yorumSil
};