const { joinVoiceChannel } = require("@discordjs/voice");
const Genius = require('genius-lyrics');
const { getLyrics, getSong } = require('genius-lyrics-api');

module.exports = {
    name: "song",
    description: "Comandos Song",
    options: [
        {
            name: 'addend',
            description: 'Agrega La Canción a la Ultima Fila',
            type: 1,
        },
        {
            name: 'forward',
            description: 'Adelanta la Canción En Segundos',
            type: 1,
            options: [{ name: 'segundos', description: 'Escriba Cuantos Segundos Va Adelantar La Canción!', type: 'INTEGER', required: true }]
        },
        {
            name: 'rewind',
            description: 'Rebobina La Canción En Segundos',
            type: 1,
            options: [{ name: 'segundos', description: 'Escriba Cuantos Segundos Va Rebobinar La Canción!', type: 'INTEGER', required: true }]
        },
        {
            name: 'lyrics',
            description: 'Muestra La Letra De La Canción',
            type: 1,
        },
        {
            name: 'seek',
            description: 'Adelanta y Rebobina la Canción En Segundos',
            type: 1,
            options: [
                {
                    name: 'segundos',
                    description: 'Escriba Cuantos Segundos Va Adelantar La Canción',
                    type: 'INTEGER',
                    required: true,
                }
            ],
        },
        {
            name: 'join',
            description: 'Invocas Al Bot En El Canal De Voz',
            type: 1
        },
        {
            name: 'leave',
            description: 'Votas Al Bot Del Canal De Voz!',
            type: 1,
        },
        {
            name: 'loop',
            description: 'Loopea Las Canciónes!',
            type: 1,
        },
        {
            name: 'radio',
            description: 'Reproduce La Radio Chill',
            type: 1,
        },
        {
            name: 'replay',
            description: 'Vuelve a Reproducir La Canción!',
            type: 1,
        }
    ],
    BotPermissions: ["Hablar", "Conectar"],
    run: async (client, interaction, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, canalmusica) => {

        const subcommand = interaction.options.getSubcommand()

        let { guild, member, guildId } = interaction;

        const canal = interaction.member.voice.channel;

        if(!canalmusica) return interaction.reply({
            embeds:  [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Estar En Un Canal De Voz!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        if(interaction.guild.me.voice.channel && canalmusica.id !== interaction.guild.me.voice.channel.id) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Necesitas Estar En Mi Canal De Voz!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        const queue = client.distube.getQueue(canalmusica);

        if(subcommand == 'addend'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            client.distube.play(canal, queue.songs[0].url, {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.done} | La Canción Fue Movida a la Ultima Cola!`)
                    .setColor('GREEN')
                ]
            });
        }
        if(subcommand == 'forward'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            let seekNumero = args[1];
            let seekTiempo = queue.currentTime + seekNumero;
            if(seekTiempo >= queue.songs[0].duration) seekTiempo = queue.songs[0].duration - 1;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏩ | La Canción Fue Adelantada \`${seekNumero}\` En Segundos!`)
                    .setColor('GREEN')
                ]
            });

            await queue.seek(seekTiempo)
        }
        if(subcommand == 'rewind'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            let numero_seek = args[1];

            let numero_tiempo = queue.currentTime - numero_seek;

            if(numero_tiempo < 0) numero_tiempo = 0;

            if(numero_tiempo >= queue.songs[0].duration - queue.currentTime) numero_tiempo;

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏩ | La Canción Fue Rebobinada \`${numero_seek}\` En Segundos!`)
                    .setColor('GREEN')
                ]
            });

            await queue.seek(numero_tiempo)
        }

        if(subcommand == 'lyrics'){

            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            const name = queue.songs.map((song, id) => song.name).slice(0, 1).join('\n');

            const Client = new Genius.Client(client.config.lyrics);

            let song = queue.songs[0];

            const search = await Client.songs.search(name);
    
            const firstSong = search[0];
    
            const lyricsd = await firstSong.lyrics().catch(err => {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Encontre la letra de Esa Canción!`)
                        .setColor('RED')
                    ]
                })
            })
    
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setAuthor({ name: '📑 | Lyrics', iconURL: song.thumbnail, url: song.url})
                    .setThumbnail(song.thumbnail)
                    .setDescription(`${(lyricsd).substring(0, 4096)}`)
                    .setColor('GREEN')
                ]
            });

        }
        if(subcommand == 'seek'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            let numero_seek = args[1];

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏩ | La Canción Fue Adelantada \`${numero_seek}\` En Segundos!`)
                    .setColor('GREEN')
                ]
            });

            if(numero_seek > queue.songs[0].duration || numero_seek) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡La Posición Debe Ser Desde \`0\` hasta \`${queue.songs[0].duration}\`!`)
                    .setColor('RED')
                ],
                ephemeral: true
            })

            await queue.seek(numero_seek);

        }
        if(subcommand == 'join'){
            let channel = client.channels.cache.find((c) => c.id == canal.id)

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.done} | Conectado En **<#${canal.id}>**`)
                    .setColor('GREEN')
                ]
            });
        }
        if(subcommand == 'leave'){
            let channel = client.channels.cache.find((c) => c.id == canal.id)

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            connection.destroy(true)

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.done} | Desconectado En **<#${canal.id}>**`)
                    .setColor('GREEN')
                ]
            });
        }
        if(subcommand == 'loop'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            if(queue.repeatMode === 0){
                queue.setRepeatMode(2);
                return interaction.reply({
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
                return interaction.reply({
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
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`🔁 Loop 🔁`)
                        .setDescription(`Loop Establecido En \`Apagado\``)
                        .setColor('RED')
                    ]
                });
            }
        }
        if(subcommand == 'radio'){
            client.distube.play(interaction.member.voice.channel, "https://www.youtube.com/watch?v=21qNxnCS8WU", {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.done} | ¡La Radio Se Esta Reproduciendo!`)
                    .setColor('GREEN')
                ]
            }).then(setTimeout(() => interaction.deleteReply(), 5000))
        }
        if(subcommand == 'replay'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ]
            });
    
            const song = queue.songs[0];
    
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('🎵 Reproduciendo Ahora 🎵')
                    .setDescription(`[${song.name}](${song.url})`)
                    .setColor('LUMINOUS_VIVID_PINK')
                    .setThumbnail(`${song.thumbnail}`)
                    .setFooter({ text: `Hecho Por: ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true, format: 'png', size: 512 })})                
                ]
            });
    
            client.distube.seek(canal, 0)
        }

    }
}