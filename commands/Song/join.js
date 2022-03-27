const { joinVoiceChannel } = require('@discordjs/voice')

module.exports = {
    name: 'join',
    description: 'Invocas Al Bot En El Canal De Voz',
    uso: 'join',
    category: 'Song',
    async execute(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, prefix) {
        
        const canal = message.member.voice.channel;

        if(!canal) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Estar En Un Canal De Voz!`)
                .setColor('RED')
            ]
        });

        const micanal = message.guild.me.voice.channel && canal.id !== message.guild.me.voice.channel.id;

        if(micanal) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Estar En Mi Canal De Voz!`)
                .setColor('RED')
            ]
        });

        let channel = client.channels.cache.find(c => c.id == canal.id)

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | Conectado En **<#${canal.id}>**`)
                .setColor('GREEN')
            ]
        });




    }
}