const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
    guildId: { type: String, require: true, unique: true },
    guildName: { type: String, require: true },
    prefix: { type: String, default: null }
})

const model = mongoose.model('servers', serverSchema);

module.exports = model;