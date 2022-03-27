const { Message } = require("discord.js");

module.exports = {
    name: 'radio',
    description: 'Reproduce La Radio Chill',
    uso: 'RADIO',
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

        const queue = client.distube.getQueue(canal);

        if(!queue) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                .setColor('RED')
            ]
        });

        client.distube.play(interaction.member.voice.channel, "https://www.youtube.com/watch?v=21qNxnCS8WU", {
            textChannel: interaction.channel,
            member: interaction.member,
            interaction
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | ¡La Radio Se Esta Reproduciendo!`)
                .setColor('GREEN')
            ]
        });

    }
}