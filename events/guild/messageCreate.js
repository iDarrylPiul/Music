require('dotenv').config();
const serverModel = require('../../models/serverSchema')
const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = async (client, Discord, message) => {

    if(message.author.bot) return;

    if(message.channel.type === "DM") return;

    let prefix = `${client.config.prefix}`

    let server = await serverModel.findOne({ guildId: message.guild.id })

    if(server) {
        if(server.prefix !== null || server.prefix.trim() !== ""){
            prefix = server.prefix
        }
    }

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find((a) => a.alias && a.alias.includes(cmd))
    
    if(command) command.execute(client, message, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, prefix);   

}