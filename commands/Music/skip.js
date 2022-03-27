module.exports = {
    name: 'skip',
    description: 'Salta las Canciónes',
    uso: 'skip',
    category: 'Músic',
    alias: ['s'],
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

        if(!queue.autoplay && queue.songs.length <= 1) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Hay Canciónes En Cola!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`⏩ | ¡La Canción Fue Saltada Correctamente!`)
                .setColor('GREEN')
            ]
        });

        client.distube.skip(canal);

    }
}