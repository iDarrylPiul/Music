module.exports = {
    name: "queue",
    description: "Comandos Queue",
    options: [
        {
            name: 'clear',
            description: "Limpia la queue",
            type: 1,
        },
        {
            name: 'list',
            description: "Muestra la Cola",
            type: 1,
        },
        {
          name: 'move',
          description: "Altera El Orden De Las Canciónes",
          type: 1,
          options: [{ name: 'numero_cancion', description: 'Escriba La Posición De La Canción!', type: 'INTEGER', required: true }, { name: 'numero_mover', description: 'Escriba La Posición Que Vas a Mover!', type: 'INTEGER', required: true }]
        },
        {
          name: 'remove',
          description: "Elimina las Canciónes",
          type: 1,
          options: [{ name: 'cancion_remover', description: 'Escriba La Canción Para Remover!', type: 'STRING', required: true }]
        },
        {
          name: 'shuffle',
          description: "Altera El Orden De Las Canciónes",
          type: 1,
        },
        {
          name: 'now_playing',
          description: "Vez la Canción Reproduciendose",
          type: 1,
        },
        {
          name: 'jump',
          description: 'Salta las Canciónes',
          type: 1,
          options: [{ name: 'numero', description: 'Escriba El Número de la Canción', type: 'INTEGER', required: true }]
        },
        {
          name: 'autoplay',
          description: 'Activas El Modo Automatico',
          type: 1,
        },
        {
          name: 'volume',
          description: "Altera El Volumen De La Canción",
          type: 1,
          options: [{ name: 'volumen_numero', description: 'Escriba Cuanto Volumen Va Dar!', type: 'INTEGER', required: true }]
        }
    ],
    BotPermissions: ["SPEAK", "CONNECT"],
    run: async (client, interaction, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, canalmusica) => {

        const subcommand = interaction.options.getSubcommand()

        const canal = interaction.member.voice.channel;

        if(!canalmusica) return interaction.reply({
            embeds:  [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Debes Estar En Un Canal De Voz!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        if(interaction.guild.me.voice.channel && canalmusica.id !== interaction.guild.me.voice.channel.id) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Debes Estar En Mi Canal De Voz!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        const queue = client.distube.getQueue(canalmusica);

        if(subcommand == 'clear') {
            if(!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
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
        if(subcommand == 'list'){
            if (!queue) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
                    .setColor('RED')
                ],
                ephemeral: true
            });
    
            let listaqueue = [];
            var maximascanciones = 10;
            for (let i = 0; i < queue.songs.length; i += maximascanciones) {
              let canciones = queue.songs.slice(i, i + maximascanciones);
              listaqueue.push(canciones.map((cancion, index) =>`**\`${i + index}\`** - [\`${cancion.name}\`](${cancion.url})`).join("\n "));
            }
    
            var limite = listaqueue.length;
            var embeds = [];
            for (let i = 0; i < limite; i++) {
              let desc = String(listaqueue[i]).substring(0, 2048);
              let embed = new MessageEmbed()
                .setTitle(
                  `🎶 Cola de ${interaction.guild.name} - \`[${
                    queue.songs.length - 1
                  } ${queue.songs.length - 1 > 1 ? "Canciónes" : "Canción"}]\``
                )
                .setColor("#8400ff")
                .setDescription(desc);
              if (queue.songs.length > 1)
                embed.addField(
                  `💿 Canción Actual`,
                  `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`
                );
              await embeds.push(embed);
            }
            return paginacion();
    
            async function paginacion() {
              let paginaActual = 0;
    
              if (embeds.length === 1)
                return interaction
                  .reply({ embeds: [embeds[0]] })
                  .catch(() => {});
    
              let boton_atras = new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("Atrás")
                .setEmoji("929001012176507040")
                .setLabel("Atrás");
              let boton_inicio = new MessageButton()
                .setStyle("DANGER")
                .setCustomId("Inicio")
                .setEmoji("🏠")
                .setLabel("Inicio");
              let boton_avanzar = new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("Avanzar")
                .setEmoji("929001012461707335")
                .setLabel("Avanzar");

            const row = new MessageActionRow().addComponents(boton_atras, boton_inicio, boton_avanzar)
                
            const embed = interaction.reply({
                content: `**Haz click en los __Botones__ para cambiar de páginas**`,
                embeds: [
                  embeds[0].setFooter({
                    text: `Pagina ${paginaActual + 1} / ${embeds.length}`,
                  }),
                ],
                components: [row],
              }).catch((err) => console.log('AJAJAJJA'))
    
              let filter = (i) => i.user.id == interaction.user.id;
    
              const collector = await interaction.channel.createMessageComponentCollector(filter, {
                time: 10000
              })
    
              collector.on("collect", async (b) => {
                if(b?.user.id !== interaction.user.id) return b?.reply({
                  embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | Solo La Persona Que Escribio El Comando Puede Usar Los Botones!`)
                    .setColor('RED')
                  ]
                });
                switch (b?.customId) {
                  case "Atrás":
                    {
                      collector.resetTimer();
                      if (paginaActual !== 0) {
                        paginaActual -= 1;
                        await interaction
                          .editReply({
                            embeds: [
                              embeds[paginaActual].setFooter({
                                text: `Pagina ${paginaActual + 1} / ${
                                  embeds.length
                                }`,
                              }),
                            ],
                            components: [row],
                          })
                          .catch(() => {});
                        await b?.deferUpdate();
                      } else {
                        paginaActual = embeds.length - 1;
                        await interaction
                          .editReply({
                            embeds: [
                              embeds[paginaActual].setFooter({
                                text: `Pagina ${paginaActual + 1} / ${
                                  embeds.length
                                }`,
                              }),
                            ],
                            components: [row],
                          })
                          .catch(() => {});
                        await b?.deferUpdate();
                      }
                    }
                    break;
    
                  case "Inicio":
                    {
                      collector.resetTimer();
                      paginaActual = 0;
                      await interaction
                        .editReply({
                          embeds: [
                            embeds[paginaActual].setFooter({
                              text: `Pagina ${paginaActual + 1} / ${embeds.length}`,
                            }),
                          ],
                          components: [row],
                        })
                        .catch(() => {});
                      await b?.deferUpdate();
                    }
                    break;
    
                  case "Avanzar":
                    {
                      collector.resetTimer();
                      if (paginaActual < embeds.length - 1) {
                        paginaActual++;
                        await interaction
                          .editReply({
                            embeds: [
                              embeds[paginaActual].setFooter({
                                text: `Pagina ${paginaActual + 1} / ${
                                  embeds.length
                                }`,
                              }),
                            ],
                            components: [row],
                          })
                          .catch(() => {});
                        await b?.deferUpdate();
                      } else {
                        paginaActual = 0;
                        await interaction
                          .editReply({
                            embeds: [
                              embeds[paginaActual].setFooter({
                                text: `Pagina ${paginaActual + 1} / ${
                                  embeds.length
                                }`,
                              }),
                            ],
                            components: [row],
                          })
                          .catch(() => {});
                        await b?.deferUpdate();
                      }
                    }
                    break;
    
                  default:
                    break;
                }
              });
              collector.on("end", () => {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                row.components[2].setDisabled(true);
                interaction
                  .editReply({
                    embeds: [
                      embeds[paginaActual].setFooter({
                        text: `Pagina ${paginaActual + 1} / ${embeds.length}`,
                      }),
                    ],
                    components: [],
                  })
                  .catch(() => {});
              });
            }
        }
        if(subcommand == 'move'){
          if(!queue) return interaction.reply({
            embeds: [
              new MessageEmbed()
              .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
              .setColor('RED')
            ],
            ephemeral: true
        });

        let songIndex = args[1];
        let position = args[2];
        if(position >= queue.songs.length || position < 0) position = -1;

        if(songIndex > queue.songs.length - 1) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡La Última Canción Tiene Índice: \`${queue.songs.length - 1}\`!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        if(songIndex === 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡El Número debe ser Mayor a 0!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        if(position === 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡El Número debe ser Mayor a 0!`)
                .setColor('RED')
            ],
            ephemeral: true
        });

        let song = queue.songs[songIndex];

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.done} | Movido a la \`${position}TH\``)
                .setColor('GREEN')
            ]
        });

        queue.songs.splice(songIndex);
        queue.addToQueue(song, position);
      }
      if(subcommand == 'remove'){
        if(!queue) return interaction.reply({
          embeds: [
              new MessageEmbed()
              .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
              .setColor('RED')
          ],
          ephemeral: true
      });

      let songIndex = args[1]
      amount = 1;

      if(songIndex > queue.songs.length - 1) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | ¡La Última Canción Tiene Índice: \`${queue.songs.length - 1}\`!`)
        ],
        ephemeral: true
      });

      if(songIndex <= 0) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} ¡El Número debe ser Mayor a 0!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      queue.songs.splice(songIndex, amount);

      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.remove} | ¡La Posición ${songIndex}TH Fue Eliminada!`)
          .setColor('GREEN')
        ]
      });
    }

    if(subcommand == 'shuffle') {
      if(!queue) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
            .setColor('RED')
        ],
        ephemeral: true
      });
      
      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.shuffle} | Se Mezclo El Orden De Las ${queue.songs.length - 1} Canciónes!`)
          .setColor('GREEN')
      ]
    });
    
    await queue.shuffle();
    }
    if(subcommand == 'now_playing'){
      if(!queue) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
            .setColor('RED')
        ],
        ephemeral: true
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

      interaction.reply({
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
      
      const collector = await interaction.channel.createMessageComponentCollector(filter, {
        time: 0
      });

      collector.on('collect', async (i) => {
        if(i.user.id !== song.user.id) return i.reply({
          embeds: [
            new MessageEmbed()
            .setDescription(`${client.config.error} | ¡Solo la Persona Que Puso la Canción Puede Interactuar Con Los Botones!`)
            .setColor('RED')
          ],
          ephemeral: true
        });
        const canal = i.member.voice.channel;
        if(!canal) return i.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Debes Estar En Un Canal De Voz!`)
                .setColor('RED')
            ],
            ephemeral: true
        });
        const micanal = i.guild.me.voice.channel && i.member.voice.channel.id !== i.guild.me.voice.channel.id;
        if(micanal) return i.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Debes Estar En Mi Canal De Voz!`)
                .setColor('RED')
            ],
            ephemeral: true
        });
        let queue = client.distube.getQueue(canal)

        if(i.customId == 'stop'){
            if(queue) {
                client.distube.stop(canal)
                i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription('🛑 | La Lista De Canciónes Fue Borrada!')
                        .setColor('GREEN')
                    ]
                })
            } else if(!queue) {
                return i.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | La Lista Canciónes Ya Esta Borrada!`)
                        .setColor('RED')
                    ],
                    ephemeral: true
                })
            }
        }
        if(i.customId == 'pausar'){
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
        }
        if(i.customId == 'resumir'){
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
            })

            client.distube.resume(canal)
        }
        if(i.customId == 'anterior'){
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
        }
        if(i.customId == 'saltar'){
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
            })

            client.distube.skip(canal)
        }
    });
    }
    if(subcommand == 'jump'){
      if(!queue) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      let numero = args[1];
      
      if(numero > queue.songs.length - 1) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | ¡Necesitas Indicar Una Posición Válida Para Adelantar!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`⏩ | La Canción Fue Saltada En \`${numero}\`TH!`)
          .setColor('GREEN')
        ]
      }).then(setTimeout(() => interaction.deleteReply(), 5000));
      
      client.distube.jump(canal, numero)
    }
    if(subcommand == 'autoplay'){
      if(!queue) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      let modo = client.distube.toggleAutoplay(canal);
      
      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.done} | El Modo Automatico Fue Establecido En  \`${String(modo ? "Encendido" : "Apagado")}\``)
          .setColor('GREEN')
        ]
      });
    }

    if(subcommand == 'volume'){
      if(!queue) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | ¡No Hay Canciónes Reproduciendose!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      let sonido = args[1];
      
      if(sonido < "1") return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | Escriba Un Número Mayor a 1!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      if(sonido > "200") return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(`${client.config.error} | Escriba Un Número Menor a 200!`)
          .setColor('RED')
        ],
        ephemeral: true
      });
      
      client.distube.setVolume(canal, sonido)
      
      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setDescription(` ${client.config.volume} | Volumen Ajustado a **${sonido}**%`)
          .setColor("GREEN")
        ]
      });
    }

    }
}