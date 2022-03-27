const serverSchema = require('../../models/serverSchema')

module.exports = async (client, guild, discord) => {
    serverSchema.create({
        guildId: guild.id,
        guildName: guild.name,
    }).catch(console.log)
}