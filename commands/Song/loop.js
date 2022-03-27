module.exports = {
    name: 'loop',
    description: 'Loopea las Canciónes',
    uso: 'loop',
    category: 'Song',
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

        if(queue.repeatMode === 0){
            queue.setRepeatMode(2);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('🔂 Loop 🔂')
                    .setDescription(`Loop Establecido En \`Bucle Queue\``)
                    .setColor('GREEN')
                ]
            });
        }
        if(queue.repeatMode === 2){
            queue.setRepeatMode(1)
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('🔂 Loop 🔂')
                    .setDescription(`Loop Establecido En \`Bucle Canción\``)
                    .setColor('GREEN')
                ]
            });
        }
        if(queue.repeatMode === 1){
            queue.setRepeatMode(0)
            return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`🔁 Loop 🔁`)
                    .setDescription(`Loop Establecido En \`Apagado\``)
                    .setColor('RED')
                ]
            });
        }

    }
}