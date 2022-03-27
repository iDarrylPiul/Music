module.exports = {
    name: 'play',
    description: 'Reproduce Música',
    uso: 'play <canción/url>',
    alias: ['p'],
    category: 'Músic',
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

        if(!args[0]) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Escribe Una Canción Para Buscar!`)
                .setColor('RED')
            ]
        });

        client.distube.play(canal, args.join(' '), {
            textChannel: message.channel,
            member: message.member,
            message
        });

    }
}