const mongoose = require("mongoose");

module.exports = (client) => {

    mongoose.connect(client.config.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Conectado a MongoDB");
        console.log("--------------------- LOGS DEL BOT ---------------------");
    }).catch(e => console.log(e))

}