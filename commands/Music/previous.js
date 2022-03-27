module.exports = {
    name: 'previous',
    description: 'Vuelves a la Anterior Canción',
    uso: 'previous',
    category: 'Músic',
    alias: ['prev'],
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

        if(queue.previousSongs.length > 1) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Hay Canciónes Previas!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`⏪ | Volvi a la Anterior Canción!`)
                .setColor('GREEN')
            ]
        });

        client.distube.previous(canal);

    }
}