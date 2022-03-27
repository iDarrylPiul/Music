module.exports = {
    name: 'shuffle',
    description: 'Altera El Orden De Las Canciónes',
    uso: 'shuffle',
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

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.shuffle} | Se Mezclo El Orden De Las ${queue.songs.length - 1} Canciónes!`)
                .setColor('GREEN')
            ]
        });

        client.distube.shuffle(canal)

    }
}