const cooldown = new Set()

module.exports = {
    name: "music",
    description: "Comandos Musica",
    options: [
        {
            name: 'play',
            description: 'Reproduce Música',
            type: 1,
            options: [{ name: 'cancion', description: '¡Escriba La Canción Para Buscar!', type: 'STRING', required: true, }]
        },
        {
            name: 'skip',
            description: 'Salta las Canciónes',
            type: 1
        },
        {
            name: 'stop',
            description: 'Detiene Las Canciónes',
            type: 1
        },
        {
            name: 'filter',
            description: 'Añade Un Filtro a la Queue',
            type: 1,
            options: [{ name: 'filters', description: 'Escriba Un Filtro Para Añadir!', type: "STRING", required: true, choices: [{ name: '8d', value: '8d' }, { name: 'bassboost', value: 'bassboost' }, { name: 'echo', value: 'echo' }, { name: 'karaoke', value: 'karaoke' }, { name: 'nightcore', value: 'nightcore' }, { name: 'vaporwave', value: 'vaporwave' }, { name: 'flanger', value: 'flanger' }, { name: 'gate', value: 'gata' }, { name: 'hass', value: 'hass' }, { name: 'reverse', value: 'reverse' }, { name: 'surround', value: 'surround' }, { name: 'mcompand', value: 'mcompand' }, { name: 'phaser', value: 'phaser' }, { name: 'tremolo', value: 'tremolo' }, { name: 'earwax', value: 'earwax' }, { name: 'clear', value: 'clear' }, { name: 'earrape', value: 'earrape' }, { name: 'subboost', value: 'subboost' }, { name: 'pulsator', value: 'pulsator' }, { name: 'vibrato', value: 'vibrato' }, { name: 'purebass', value: 'purebass' }, { name: 'lightbass', value: 'lightbass' }, { name: 'heavybass', value: 'heavybass' }] }]
        },
        {
            name: 'pause',
            description: 'Pausa La Canción',
            type: 1,
        },
        {
            name: 'resume',
            description: 'Continua la Canción Pausada',
            type: 1,
        },
        {
            name: 'search',
            description: 'Busca Canciónes',
            type: 1,
            options: [{ name: 'cancion', description: '¡Escriba Una Canción Para Buscar!', type: 'STRING', required: true }]
        },
        {
            name: 'previous',
            description: 'Vuelves a la Anterior Canción',
            type: 1,
        }
    ],
    BotPermissions: ["SPEAK", "CONNECT"],
    run: async (client, interaction, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, canalmusica) => {

        const subcommand = interaction.options.getSubcommand()

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

        if(subcommand == 'play') {
            const cancion = args[1]

            client.distube.play(canalmusica, cancion, {
                textChannel: interaction.channel,
                member: interaction.member,
                interaction
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.search} | Buscando \`${cancion}\``)
                    .setColor('GREEN')
                ]
            }).then(setTimeout(() => interaction.deleteReply(), 5000))
        }
        if(subcommand == 'skip'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true,
            });

            if (!queue.autoplay && queue.songs.length <= 1) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes En Cola!`)
                    .setColor('RED')
                ],
                ephemeral: true,
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏩ | ¡La Canción Fue Saltada Correctamente!`)
                    .setColor('GREEN')
                ]
            });

            client.distube.skip(canalmusica)
        }
        if(subcommand == 'stop') {
            if(queue){
                client.distube.stop(canalmusica)
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.stop} | ¡La Lista De Canciónes Fue Borrada!`)
                        .setColor('GREEN')
                    ]
                });
            } else if (!queue) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡La Lista De Canciónes Ya Esta Borrada!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });
            }
        }
        if(subcommand == 'filter'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            let filters = args[1]

            const filtros = client.distube.setFilter(canalmusica, filters);

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.filter} | Se Añadio: \`` + (filtros.join(", ") || "Apagado") + `\``)
                    .setColor('GREEN')
                ]
            });
        }
        if(subcommand == 'pause'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            if(queue.paused) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡La Canción Ya Esta Pausada!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏸️ | La Lista De Canciónes Fue Pausada!`)
                    .setColor('GREEN')
                ]
            });

            client.distube.pause(canalmusica)
        }
        if(subcommand == 'resume'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            if(queue.playing === true) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡La Canción Ya Esta Resumida!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`▶️ | La Lista De Canciónes Fue Resumida!`)
                    .setColor('GREEN')
                ]
            });

            client.distube.resume(canalmusica);
        }
        if(subcommand == 'search'){

            if(cooldown.has(interaction.user.id)) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡Espera 15 Segundos Para Volver a Ejecutar El Comando!`)
                    .setColor('RED')
                ]
            });

            cooldown.add(interaction.user.id)
            setTimeout(() => {
                cooldown.delete(interaction.user.id);
            }, 15000)
            
            let song = args[1]

            const msg_filter = m => m.author.id === interaction.user.id;

            const results = await client.distube.search(song)

            const rls = results.slice(0, 10)

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId('1')
                .setEmoji('929001012189102110')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('2')
                .setEmoji('929001012109406218')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('3')
                .setEmoji('929001012029714433')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('4')
                .setEmoji('929001012000354355')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('5')
                .setEmoji('929001011845148683')
                .setStyle('PRIMARY'),
            )

            const row1 = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId('6')
                .setEmoji('929001012071645225')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('7')
                .setEmoji('929001012101009438')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('8')
                .setEmoji('929001011597688833')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('9')
                .setEmoji('929001012025499728')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('10')
                .setEmoji('929001012000325643')
                .setStyle('PRIMARY')
            )

            let filter = i => i.user.id == interaction.user.id;

            const m = await interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`${client.config.search} | Resultados De ${song}`)
                    .setColor("GREEN")
                    .setDescription(`${rls.map((song, i) => `**${i + 1}** - [${song.name}](${song.url})`).join("\n")}`)
                    .setFooter({text: "¡Elige Cualquier Resultado O Escriba Cualquier Cosa Para Cancelar O Espera 15 Segundos Para Cancelar!"})
                ],
                components: [row, row1]
            });

            const collector2 = await interaction.channel.createMessageCollector({
                filter: msg_filter,
                max: 1,
                time: 15000
            });

            const collector = await interaction.channel.createMessageComponentCollector(filter, {
                time: 15000
            });

            collector.on('collect', async (i) => {
                if(i.user.id !== interaction.user.id) return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | Solo La Persona Que Solicito El Comando Puede Interactuar Con Los Botones!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                });

                if(i.customId == '1'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(1)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 1 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '2'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(2)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 2 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '3'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(3)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 3 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '4'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(4)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 4 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '5'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(5)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 5 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '6'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(6)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 6 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '7'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(7)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 7 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '8'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(8)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 8 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '9'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(9)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 9 No Existe!`)
                            .setColor('RED')
                        ]
                    }))


                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }

                if(i.customId == '10'){
                    client.distube.play(
                        i.member.voice.channel,
                        rls[parseInt(10)-1],
                        {
                            textChannel: i.channel,
                            member: i.member,
                        }
                    ).catch(err => i.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡El Resultado 10 No Existe!`)
                            .setColor('RED')
                        ]
                    }))

                    await i.deferUpdate();

                    collector.stop();
                    collector2.stop();
                }
            });

            collector.on('end', async () => {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                row.components[2].setDisabled(true);
                row.components[3].setDisabled(true);
                row.components[4].setDisabled(true);
                row1.components[0].setDisabled(true);
                row1.components[1].setDisabled(true);
                row1.components[2].setDisabled(true);
                row1.components[3].setDisabled(true);
                row1.components[4].setDisabled(true);
                interaction.editReply({
                    components: [row, row1]
                }).then(setTimeout(() => interaction.deleteReply(), 60000));
            })

            collector2.on('collect', async (collected) => {

                if(parseInt(collected) > 0 && parseInt(collected) <= 10){
                    client.distube.play(interaction.member.voice.channel, rls[parseInt(collected)-1], {
                        textChannel: interaction.channel,
                        member: interaction.member,
                        interaction
                    });
    
                    collector.stop();
                } else {
                    collector.stop()
                    return interaction.followUp({
                        embeds: [
                            new MessageEmbed()
                            .setDescription(`${client.config.error} | ¡La Busqueda Fue Cancelada!`)
                            .setColor('RED')
                        ],
                        components: []
                    });
                }
            });

            collector2.on('end', async (collected) => {
                collector.stop()
            })
        }

        if(subcommand == 'previous'){
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            if(queue.previousSongs.length < 1) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Previas!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`⏪ | Volvi a la Anterior Canción!`)
                    .setColor('GREEN')
                ]
            });

            client.distube.previous(canalmusica);
        }

    }
}