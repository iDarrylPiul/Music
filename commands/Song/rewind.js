module.exports = {
    name: 'rewind',
    description: 'Rebobina La Canción En Segundos',
    uso: 'rewind <Segundos>',
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

        let seekNumber = Number(args[0]);
        let seektime = newQueue.currentTime - seekNumber;
        if(seektime < 0) seektime = 0;

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`⏩ | La Canción Fue Rebobinada \`${numero_seek}\` En Segundos!`)
                .setColor('GREEN')
            ]
        });

        await queue.seek(seektime)

    }
}