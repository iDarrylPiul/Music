module.exports = {
    name: 'clear',
    description: 'Limpia la queue',
    uso: 'clear',
    category: 'Queue',
    alias: ['clearqueue'],
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

        let monto = queue.songs.length - 2;

        queue.songs = [queue.songs[0]];

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | ¡La Queue Fue Limpiada Correctamente!`)
                .setColor('GREEN')
            ]
        });

    }
}