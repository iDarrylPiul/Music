module.exports = {
    name: 'move',
    description: 'Altera El Orden De Las Canciónes',
    uso: 'move <numero_cancion> <posicion_numero>',
    category: 'Queue',
    alias: ['mover'],
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

        if(!args[0]) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Declarar El <numero_cancion> y tambien <posicion_numero>!`)
                .setColor('RED')
            ]
        });

        if(!args[1]) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Declarar <posicion_numero>!`)
                .setColor('RED')
            ]
        });

        let songIndex = Number(args[0])

        if(!songIndex) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Declarar El <numero_cancion> y tambien <posicion_numero>!`)
                .setColor('RED')
            ]
        });

        let position = Number(args[1]);

        if(!position) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Declarar <posicion_numero>!`)
                .setColor('RED')
            ]
        });

        if(position >= queue.songs.length || position < 0) position = -1;

        if(songIndex > queue.songs.length - 1) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡La Última Canción Tiene Índice: \`${queue.songs.length - 1}\`!`)
                .setColor('RED')
            ]
        });

        if(songIndex === 0) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡El Número debe ser Mayor a 0!`)
                .setColor('RED')
            ]
        });

        if(position === 0) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡El Número debe ser Mayor a 0!`)
                .setColor('RED')
            ]
        });

        let song = queue.songs[songIndex];

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | Movido a la \`${position}TH\``)
                .setColor('GREEN')
            ]
        });

        queue.songs.splice(songIndex);
        queue.addToQueue(song, position);

    }
}