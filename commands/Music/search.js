const cooldown = new Set()

module.exports = {
    name: 'search',
    description: 'Busca Canciónes',
    uso: 'search <canción/url>',
    category: 'Músic',
    alias: ['busqueda', 'buscar'],
    async execute(client, message, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, prefix) {
        
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

        if(cooldown.has(message.author.id)) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Espera 15 Segundos Para Volver a Ejecutar El Comando!`)
                .setColor('RED')
            ]
        });

        cooldown.add(message.author.id)
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 15000)

        const msg_filter = i => i.author.id == message.author.id;

        const results = await client.distube.search(args.join(' '))

        const rls = results.slice(0, 10)

        if(!args[0]) return message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Escribe Una Canción Para Buscar!`)
                .setColor('RED')
            ]
        });

        const filter = i => i.user.id == message.author.id;

        const m = await message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(`${client.config.search} | Resultados De ${String(args.join(' '))}`)
                .setColor("GREEN")
                .setDescription(`${rls.map((song, i) => `**${i + 1}** - [${song.name}](${song.url})`).join("\n")}`)
                .setFooter({ text: "¡Elige Cualquier Resultado O Escriba Cualquier Cosa Para Cancelar O Espera 15 Segundos Para Cancelar!"})
            ],
            components: [row, row1]
        });

        const collector2 = await message.channel.createMessageCollector({
            filter: msg_filter,
            max: 1,
            time: 15000
        });

        const collector = await message.channel.createMessageComponentCollector(filter, {
            time: 15000
        });

        collector.on('collect', async (i) => {
            if(i.user.id !== message.author.id) return i.reply({
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
            m.edit({
                components: [row, row1]
            }).then(setTimeout(() => m.delete(), 60000));
        });

        collector2.on('collect', async (collected) => {

            if(parseInt(collected) > 0 && parseInt(collected) <= 10){
                client.distube.play(message.member.voice.channel, rls[parseInt(collected)-1], {
                    textChannel: message.channel,
                    member: message.member,
                    message
                });

                collector.stop();
            } else {
                collector.stop()
                return message.channel.send({
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
}