module.exports = {
    name: 'stop',
    description: 'Detiene Las Canciónes',
    uso: 'stop',
    category: 'Músic',
    alias: ['parar'],
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

        if(queue){
            client.distube.stop(canal);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.stop} | ¡La Lista De Canciónes Fue Borrada!`)
                    .setColor('GREEN')
                ]
            })
        } else if(!queue) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡La Lista De Canciónes Ya Esta Borrada!`)
                .setColor('RED')
            ]
        })

    }
}