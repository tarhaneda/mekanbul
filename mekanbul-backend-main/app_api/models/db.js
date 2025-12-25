var mongoose = require("mongoose");
require('dotenv').config();
var dbURI = process.env.dbURI;


mongoose.connect(dbURI);

mongoose.connection.on("connected", function () {
    console.log("Mongoose " + dbURI + " adresindeki veritabanına bağlandı.");
});
mongoose.connection.on("error", function (err) {
    console.log("Mongoose bağlantı hatası:", err);
});
mongoose.connection.on("disconnected", function () {
    console.log("Mongoose bağlantısı kesildi.");
});


if (process.env.VERCEL !== '1') {
    process.on("SIGINT", function () {
        mongoose.connection.close();
        console.log("Mongoose uygulama sonlandırma nedeniyle bağlantıyı kapattı.");
        process.exit(0);
    });
}

require("./venue");
require("./users");