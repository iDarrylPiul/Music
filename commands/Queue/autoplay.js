module.exports = {
    name: 'autoplay',
    description: 'Activas El Modo Automatico',
    uso: 'autoplay',
    category: 'Queue',
    alias: ['auto', 'playauto', 'auto-play'],
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

        let mode = client.distube.toggleAutoplay(canal);

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | El Modo Automatico Fue Establecido En  \`${String(modo ? "Encendido" : "Apagado")}\``)
                .setColor('GREEN')
            ]
        });

    }
}