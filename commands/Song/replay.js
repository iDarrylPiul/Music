module.exports = {
    name: 'replay',
    description: 'Vuelve a Reproducir La Canción!',
    uso: 'replay',
    category: 'Song',
    alias: ['resong', 're-play', 're-song'],
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

        const song = queue.songs[0];
    
        message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('🎵 Reproduciendo Ahora 🎵')
                .setDescription(`[${song.name}](${song.url})`)
                .setColor('LUMINOUS_VIVID_PINK')
                .setThumbnail(`${song.thumbnail}`)
                .setFooter({ text: `Hecho Por: ${message.member.user.tag}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 })})                
            ]
        });

        client.distube.seek(canal, 0)

    }
}