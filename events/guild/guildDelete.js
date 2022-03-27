const serverSchema = require('../../models/serverSchema')

module.exports = async (client, guild) => {
    serverSchema.findOneAndDelete({
        guildId: guild.id,
        guildName: guild.name,
    })
    .exec()
    .catch(console.log)
}