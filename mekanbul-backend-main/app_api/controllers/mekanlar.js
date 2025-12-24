var mongoose = require('mongoose');
var Mekan = mongoose.model('venue');

var cevapOlustur = function (res, status, content) {
    res.status(status).json(content);
};

var mekanlariListele = async function (req, res) {
    var boylam = parseFloat(req.query.long);
    var enlem = parseFloat(req.query.lat);

    var nokta = {
        type: "Point",
        coordinates: [boylam, enlem]
    };
    var geoOptions = {
        distanceField: "mesafe",
        spherical: true,
        key: "coordinates"
    };

    if (!enlem || !boylam) {
        try {
            const result = await Mekan.find({});
            cevapOlustur(res, 200, result);
        } catch (e) {
            cevapOlustur(res, 404, e);
        }
        return;
    }

    try {
        const result = await Mekan.aggregate([
            {
                $geoNear: {
                    near: nokta,
                    ...geoOptions
                }
            }
        ]);

        const mekanlar = result.map(mekan => {
            return {
                _id: mekan._id,
                name: mekan.name,
                address: mekan.address,
                rating: mekan.rating,
                foodanddrink: mekan.foodanddrink,
                distance: mekan.mesafe // Raw meters
            };
        });
        cevapOlustur(res, 200, mekanlar);
    } catch (err) {
        cevapOlustur(res, 404, err);
    }
};

var mekanEkle = async function (req, res) {
    try {
        const mekan = await Mekan.create({
            name: req.body.name,
            address: req.body.address,
            foodanddrink: req.body.foodanddrink,
            coordinates: [parseFloat(req.body.coordinates[0]), parseFloat(req.body.coordinates[1])],
            hours: req.body.hours
        });
        cevapOlustur(res, 201, mekan);
    } catch (err) {
        cevapOlustur(res, 400, err);
    }
};

var mekanGetir = async function (req, res) {
    if (req.params && req.params.mekanid) {
        try {
            const mekan = await Mekan.findById(req.params.mekanid).exec();
            if (!mekan) {
                cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
                return;
            }
            cevapOlustur(res, 200, mekan);
        } catch (err) {
            cevapOlustur(res, 404, err);
        }
    } else {
        cevapOlustur(res, 404, { "mesaj": "Mekan ID gerekli" });
    }
};

var mekanGuncelle = async function (req, res) {
    if (!req.params.mekanid) {
        cevapOlustur(res, 404, { "mesaj": "Mekan ID gerekli" });
        return;
    }
    try {
        const mekan = await Mekan.findById(req.params.mekanid).select('-comments -rating').exec();
        if (!mekan) {
            cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
            return;
        }

        mekan.name = req.body.name;
        mekan.address = req.body.address;
        mekan.foodanddrink = req.body.foodanddrink;
        mekan.coordinates = [parseFloat(req.body.coordinates[0]), parseFloat(req.body.coordinates[1])];
        mekan.hours = req.body.hours;

        const updatedMekan = await mekan.save();
        cevapOlustur(res, 200, updatedMekan);
    } catch (err) {
        cevapOlustur(res, 400, err);
    }
};

var mekanSil = async function (req, res) {
    var mekanid = req.params.mekanid;
    if (mekanid) {
        try {
            const mekan = await Mekan.findByIdAndDelete(mekanid).exec(); // findByIdAndRemove stopped working in Mongoose 8
            if (!mekan) {
                cevapOlustur(res, 404, { "mesaj": "Mekan bulunamadı" });
                return;
            }
            cevapOlustur(res, 200, { "status": "success", "mesaj": "Mekan başarıyla silindi" });
        } catch (err) {
            cevapOlustur(res, 404, err);
        }
    } else {
        cevapOlustur(res, 404, { "mesaj": "Mekan ID gerekli" });
    }
};

const adminMekanlariListele = async function (req, res) {
    try {
        const mekanlar = await Mekan.find({});
        cevapOlustur(res, 200, mekanlar);
    } catch (error) {
        cevapOlustur(res, 404, error);
    }
};

module.exports = {
    mekanlariListele,
    mekanEkle,
    mekanGetir,
    mekanGuncelle,
    mekanSil,
    adminMekanlariListele
};
