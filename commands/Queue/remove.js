module.exports = {
    name: 'remove',
    description: 'Elimina las Canciónes',
    uso: 'remove <canción_remover>',
    category: 'Queue',
    alias: ['remover', 'borrar'],
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
                .setDescription(`${client.config.error} | ¡Necesitas Declarar <canción_remover>!`)
                .setColor('RED')
            ]
        });

        let songIndex = Number(args[0]);

        if(!songIndex) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Declarar <canción_remover>!`)
                .setColor('RED')
            ]
        });

        let amount = 1;

        if(songIndex > queue.songs.length - 1) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡La Última Canción Tiene Índice: \`${queue.songs.length - 1}\`!`)
                .setColor('RED')
            ]
        });

        if(songIndex <= 0) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡El Número debe ser Mayor a 0!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.remove} | ¡La Posición ${songIndex}TH Fue Eliminada!`)
                .setColor('GREEN')
            ]
        });

        queue.songs.splice(songIndex, amount)

    }
}