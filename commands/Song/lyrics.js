const Genius = require('genius-lyrics');

module.exports = {
    name: 'lyrics',
    description: 'Muestra La Letra De La Canción',
    uso: 'lyrics',
    category: 'Song',
    alias: ['letra', 'ly'],
    async execute(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, prefix) {

        const Client = new Genius.Client(client.config.lyrics);
        
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

        let song = queue.songs[0];

        if(!queue) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                .setColor('RED')
            ]
        });

        const name = queue.songs.map((song, id) => song.name).slice(0, 1).join('\n');

        const search = await Client.songs.search(name);

        const firstSong = search[0];

        const lyricsd = await firstSong.lyrics().catch(err => {
            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Encontre la letra de Esa Canción!`)
                    .setColor('RED')
                ]
            })
        })

        message.reply({
            embeds: [
                new MessageEmbed()
                .setAuthor({ name: '📑 | Lyrics', iconURL: song.thumbnail, url: song.url})
                .setThumbnail(song.thumbnail)
                .setDescription(`${(lyricsd).substring(0, 4096)}`)
                .setColor('GREEN')
            ]
        });

    }
}