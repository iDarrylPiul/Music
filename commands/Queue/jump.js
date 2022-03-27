module.exports = {
    name: 'jump',
    description: 'Salta las Canciónes',
    uso: 'jump <canción_posicion>',
    category: 'Queue',
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

        const salto = parseInt(args[0]);

        if(!salto) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.distube.error} | ¡Necesitas Declarar <canción_posicion>!`)
                .setColor('RED')
            ]
        });

        if(queue.songs.length - 1 < salto) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Indicar Una Posición Válida Para Adelantar!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`⏩ | La Canción Fue Saltada En \`${numero}\`TH!`)
                .setColor('GREEN')
            ]
        });

        client.distube.jump(canal, salto);

    }
}