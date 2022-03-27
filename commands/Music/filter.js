module.exports = {
    name: 'filter',
    description: 'Añade Un Filtro a la Queue',
    uso: 'filter <nombre_filtro>',
    category: 'Músic',
    alias: ['filtro', 'filters'],
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

        if(args[0] == 'Apagado' && queue.filters?.length) queue.setFilter(false)

        else if(Object.keys(client.distube.filters).includes(args[0])) queue.setFilter(args[0]);

        else if(args[0]) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡El Filtro \`${args.join(' ')}\` Es Inválido!`)
                .setColor('RED')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.filter} | Se Añadio: \`${queue.filters.join(', ') || 'Apagado'}\``)
                .setColor('GREEN')
            ]
        });

    }
}