const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'now_playing',
    description: 'Vez la Canción Reproduciendose',
    uso: 'nowplaying',
    category: 'Queue',
    alias: ['np', 'nowplaying'],
    async execute(client, message, args, MessageEmbed, MessageSelectMenu, prefix) {
        
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

        const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId('stop')
          .setStyle('DANGER')
          .setEmoji('🛑'),
          new MessageButton()
          .setCustomId('pausar')
          .setStyle('SECONDARY')
          .setEmoji('⏸️'),
          new MessageButton()
          .setCustomId('resumir')
          .setStyle('SUCCESS')
          .setEmoji('▶️'),
          new MessageButton()
          .setCustomId('anterior')
          .setStyle('PRIMARY')
          .setEmoji('⏮️'),
          new MessageButton()
          .setCustomId('saltar')
          .setStyle('PRIMARY')
          .setEmoji('⏭️')
        );

        let song = queue.songs[0];

        let filter = (i) => i.user.id === song.user.id;

        message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('🎵 Reproduciendo Ahora 🎵')
                .setDescription(`[${song.name}](${song.url})`)
                .setColor('LUMINOUS_VIVID_PINK')
                .setThumbnail(`${song.thumbnail}`)
                .setFooter({ text: `Añadido Por: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 })})                
            ],
            components: [row]
        });

        const collector = await message.channel.createMessageComponentCollector(filter, {
            time: 0
        });

        collector.on('collect', async (i) => {
            let { member, guild } = message;
            if(i.user.id !== song.user.id) return i.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡Solo la Persona Que Puso la Canción Puede Interactuar Con Los Botones!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            const canal = member.voice.channel;

            if(!canal) return i.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡Necesitas Estar En Un Canal De Voz!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            const micanal = guild.me.voice.channel && canal.id !== guild.me.voice.channel.id;

            if(micanal) return i.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡Necesitas Estar En Mi Canal De Voz!`)
                    .setColor('RED')
                ]
            });

            let queue = client.distube.getQueue(canal);

            if(i.customId == 'stop'){
                if(queue) {
                    client.distube.stop(canal)
                    i.reply({
                        embeds: [
                            new MessageEmbed()
                            .setDescription('🛑 | La Lista De Canciónes Fue Borrada!')
                            .setColor('GREEN')
                        ]
                    });
                } else if(!queue) {
                    return i.reply({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | La Lista Canciónes Ya Esta Borrada!`)
                            .setColor('RED')
                        ],
                        ephemeral: true
                    });
                }
            } else if(i.customId == 'pausar'){
                if(!queue) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                if(queue.paused) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡La Canción Ya Esta Pausada!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription('⏸️ | La Lista De Canciónes Fue Pausada!')
                        .setColor('GREEN')
                    ]
                });
    
                client.distube.pause(canal)
            } else if(i.customId == 'resumir'){
                if(!queue) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                if(queue.playing === true) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡La Canción Ya Esta Resumida!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription('▶️ | La Lista De Canciónes Fue Resumida!')
                        .setColor('GREEN')
                    ]
                });
    
                client.distube.resume(canal)
            } else if(i.customId == 'anterior'){
                if(!queue) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(` | ¡No Hay Canciónes Reproduciendose!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                if(queue.previousSongs.length < 1) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Hay Canciónes Anteriores!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription('⏪ | Volvi a la Anterior Canción!')
                        .setColor('GREEN')
                    ]
                });
    
                client.distube.previous(canal);
            } else if(i.customId == 'saltar'){
                if(!queue) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                if(!queue.autoplay && queue.songs.length <= 1) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Hay Canciónes En Cola!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
    
                i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription('⏩ | La Canción Fue Saltada Correctamente!')
                        .setColor('GREEN')
                    ]
                });
    
                client.distube.skip(canal)
            }
        });

    }
}