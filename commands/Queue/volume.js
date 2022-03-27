module.exports = {
    name: 'volume',
    description: 'Altera El Volumen De La Canción',
    uso: 'volume <numero_volumen>',
    category: 'Queue',
    alias: ['volumen'],
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

        const volume = parseInt(args[0]);

        if(isNaN(volume)) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Decirme Un Número Para Establecer El Volumen!`)
                .setColor('RED')
            ]
        });

        if(volume < 1) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | Escriba Un Número Mayor a 1!`)
                .setColor('RED')
            ]
        });

        if(volume > 100) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | Escriba Un Número Menor a 200!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(` ${client.config.volume} | Volumen Ajustado a **${sonido}**%`)
                .setColor("GREEN")
            ]
        });

        client.distube.setVolume(message, volume)

    }
}