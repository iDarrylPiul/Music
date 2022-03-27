module.exports = {
    name: 'seek',
    description: 'Adelanta y Rebobina la Canción En Segundos',
    uso: 'seek <Segundos>',
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

        if(!args[0]) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Declarar <Segundos>!`)
                .setColor('RED')
            ]
        });

        let song = queue.songs[0];

        let seekNumber = Number(args[0]);

        if(seekNumber > song.duration || seekNumber < 0) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡La Posición Debe Ser Desde \`0\` hasta \`${queue.songs[0].duration}\`!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`⏩ | La Canción Fue Adelantada \`${numero_seek}\` En Segundos!`)
                .setColor('GREEN')
            ]
        })

        await queue.seek(seekNumber);

    }
}