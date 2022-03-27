const { DisTube } = require('distube');
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
const https = require('https-proxy-agent');
const proxy = 'http://123.123.123.123:8080';
const agent = https(proxy);

module.exports = (client) => {
    
    client.distube = new DisTube(client, {
        searchSongs: 1,
        searchCooldown: 30,
        savePreviousSongs: true,
        youtubeDL: false,
        ytdlOptions: {
            requestOptions: {
                agent
            },
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 4,
        },
        youtubeCookie: "GPS=1; YSC=Y-q8Df0xWS0; VISITOR_INFO1_LIVE=J8HDeMbg9ho; PREF=tz=America.Montevideo&f6=40000000; CONSISTENCY=AGDxDeOUdm5dzRG5Bi3JdYbew31I8gIGKM055TVhZtmejaV14Zb1JIyy46NliQd5yLz-bK4ZwxUGswxUuhu0lo-oZbdf5wXWRuTFIysUMCBr909L_0ZnIfH-5_v6wnUtdx-EzUBOecwlhLzpFl54lQ",
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        emptyCooldown: 3600,
        customFilters: filtros,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        emitNewSongOnly: true,
        leaveOnStop: false,
        plugins: [
            new SoundCloudPlugin(),
            new SpotifyPlugin({
                parallel: true,
                emitEventsAfterFetching: true,
            }),
            new YtDlpPlugin(),
        ]
    });

    const stop = new MessageButton()
    .setCustomId('stop')
    .setStyle('DANGER')
    .setEmoji('🛑')

    const pausar = new MessageButton()
    .setCustomId('pausar')
    .setStyle('SECONDARY')
    .setEmoji('⏸️')

    const resumir = new MessageButton()
    .setCustomId('resumir')
    .setStyle('SUCCESS')
    .setEmoji('▶️')

    const anterior = new MessageButton()
    .setCustomId('anterior')
    .setStyle('PRIMARY')
    .setEmoji('⏮️')

    const saltar = new MessageButton()
    .setCustomId('saltar')
    .setStyle('PRIMARY')
    .setEmoji('⏭️')

    const row = new MessageActionRow().addComponents(stop, pausar, resumir, anterior, saltar);

    client.distube
    
    .on('initQueue', async (queue) => {
        queue.autoplay = false;
        queue.volume = 50;
    })

    .on('searchNoResult', async (message) => {
        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Encontre Resultados De \`${query}\`!`)
                .setColor('RED')
            ]
        });
    })

    .on('finish', (queue) => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | Parece Que No Hay Canciónes En Cola, Me Tendre Que Ir...`)
                .setColor('GREEN')
            ]
        });
    })

    .on('noRelared', (queue) => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Encontre Videos Relaciónados Para Reproducir!`)
                .setColor('RED')
            ]
        });
    })

    .on('playSong', async (queue, song) => {
        const m = await queue.textChannel.send({ embeds: [
            new MessageEmbed()
            .setTitle('🎵 Reproduciendo Ahora 🎵')
            .setDescription(`[${song.name}](${song.url})`)
            .setColor('LUMINOUS_VIVID_PINK')
            .setThumbnail(`${song.thumbnail}`)
            .setFooter({ text: `Añadido Por: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 })})
        ],
        components: [row]
    });

    let ifilter = (i) => i.user.id === song.user.id;

    let collector = await m.createMessageComponentCollector(ifilter, {
        time: 0
    });

    collector.on('collect', async (i) => {
        await i.deferReply();
        if (i.user.id !== song.user.id) return i.followUp({ embeds: [
            new MessageEmbed()
            .setDescription(`${client.config.error} | Solo La Persona Que Puso La Canción Puede Interactuar Con Los Botones!`)
            .setColor('RED')
        ]});
        const canal = i.member.voice.channel;
        if(!canal) return i.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Debes Estar En Un Canal De Voz!`)
                .setColor('RED')
            ]
        })
        const micanal = i.guild.me.voice.channel && i.member.voice.channel.id !== i.guild.me.voice.channel.id;
        if(micanal) return i.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Debes Estar En Mi Canal De Voz!`)
                .setColor('RED')
            ]
        })
        let queue = client.distube.getQueue(canal)

        if(i.customId == 'stop'){
            if(queue) {
                client.distube.stop(canal)
                i.followUp({
                    embeds: [
                        new MessageEmbed()
                        .setDescription('🛑 | La Lista De Canciónes Fue Borrada!')
                        .setColor('GREEN')
                    ]
                })
            } else if(!queue) {
                return i.followUp({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | La Lista Canciónes Ya Esta Borrada!`)
                        .setColor('RED')
                    ],
                })
            }
        }
        if(i.customId == 'pausar'){
            if(!queue) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ]
            });

            if(queue.paused) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡La Canción Ya Esta Pausada!`)
                    .setColor('RED')
                ]
            });

            i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription('⏸️ | La Lista De Canciónes Fue Pausada!')
                    .setColor('GREEN')
                ]
            });

            client.distube.pause(canal)
        }
        if(i.customId == 'resumir'){
            if(!queue) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ]
            });

            if(queue.playing === true) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡La Canción Ya Esta Resumida!`)
                    .setColor('RED')
                ]
            });

            i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription('▶️ | La Lista De Canciónes Fue Resumida!')
                    .setColor('GREEN')
                ]
            })

            client.distube.resume(canal)
        }
        if(i.customId == 'anterior'){
            if(!queue) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(` | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ]
            });

            if(queue.previousSongs.length < 1) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Anteriores!`)
                    .setColor('RED')
                ]
            });

            i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription('⏪ | Volvi a la Anterior Canción!')
                    .setColor('GREEN')
                ]
            });

            client.distube.previous(canal);
        }
        if(i.customId == 'saltar'){
            if(!queue) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ]
            });

            if(!queue.autoplay && queue.songs.length <= 1) return i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes En Cola!`)
                    .setColor('RED')
                ]
            });

            i.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription('⏩ | La Canción Fue Saltada Correctamente!')
                    .setColor('GREEN')
                ]
            })

            client.distube.skip(canal)
        }
    });

    })

    .on('addSong', async (queue, song) => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                .setTitle('🎵 Añadida a la Cola 🎵')
                .setDescription(`[${song.name}](${song.url})`)
                .setColor('LUMINOUS_VIVID_PINK')
                .setThumbnail(`${song.thumbnail}`)
                .setFooter({ text: `Añadido Por: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true, format: 'png' }) })
            ]
        });

    })

    .on('addList', (queue, playlist) => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                .setTitle('🎵 Añadida a la Cola 🎵')
                .setDescription(`La Playlist 🎧 \`${playlist.name}\` fue añadida con \`${playlist.songs.length}\` canciónes!`)
                .setColor('LUMINOUS_VIVID_PINK')
                .setFooter({ text: `Añadido Por: ${playlist.user.tag}`,  iconURL: playlist.user.displayAvatarURL({ dynamic: true, format: 'png' }) })            
            ]
        });
    })

    .on('error', (textChannel, e) => {

        console.log(e)

        textChannel.send({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | Ocurrio Un Error, La Solicitud Fue Avisada A los Creadores!`)
                .setColor('RED')
            ]
        })

        
        client.channels.cache.get('952293651889946694').send({
            embeds: [
                new MessageEmbed()
                .setTitle('🎵 Ocurrio Un Error 🎵')
                .setDescription(`\`\`\`${e}\`\`\``)
                .setColor('RED')
                .setFooter({ text: `REVISA HEROKU ESTUPIDO` })
            ]
        }).catch(err => console.log('froster por que eliminaste el canal ?'))
        
    });

    client.distube.on('noRelated', async (queue) => {
        queue.textChannel.send({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡No Encontre Canciónes Relaciónadas!`)
                .setColor('RED')
            ]
        })
    })
    
}