module.exports = {
    name: 'addend',
    description: 'Agrega La Canción a la Ultima Fila',
    uso: 'addend',
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

        client.distube.play(canal, queue.songs[0].url, {
            textChannel: message.channel,
            member: message.member,
            message
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | La Canción Fue Movida a la Ultima Cola!`)
                .setColor('GREEN')
            ]
        });

    }
}