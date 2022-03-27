module.exports = {
    name: 'forward',
    description: 'Adelanta la Canción En Segundos',
    uso: 'forward <Segundos>',
    category: 'Song',
    alias: ['adelantar'],
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

        let seekNumber = Number(args[0])

        let seektime = queue.currentTime + seekNumber;

        if(seektime >= queue.songs[0].duration) seektime = queue.songs[0].duration - 1;

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`⏩ | La Canción Fue Adelantada \`${seekNumero}\` En Segundos!`)
                .setColor('GREEN')
            ]
        });

        await queue.seek(seektime)

    }
}