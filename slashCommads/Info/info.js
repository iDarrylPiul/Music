module.exports = {
    name: "info",
    description: "Comandos De Información!",
    options: [
        {
            name: 'ping',
            description: "Muestra el ping del bot",
            type: 1
        },
        {
            name: 'help',
            description: 'Muestra El Menú De Ayuda',
            type: 1,
            options: [
                {
                    name: 'comando',
                    description: 'Escriba El Comando Para Obtener Información',
                    type: "STRING",
                    required: false,
                }
            ],
            options: [{ name: 'comando', description: 'Escriba El Comando Que Quiere Obtener Información', type: "STRING", required: false }],
        },
    ],
    BotPermissions: ["Hablar", "Conectar"],
    run: async (client, interaction, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, canalmusica) => {

        let { options } = interaction;

        if(options.getSubcommand() === 'ping'){
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`Mi Ping Es: ${client.ws.ping} ms!`)
                    .setColor('GREEN')
                ]
            });
        }

        if (options.getSubcommand() === 'help'){

            const StringOption = args[1];

            if (StringOption && StringOption.length > 0) {

                const cmd = StringOption.toLowerCase();

                const command = client.commands.get(cmd) || client.commands.find((a) => a.alias && a.alias.includes(cmd))
            
                if(command == undefined) return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡No Encontre El Comando \`${cmd}\`!`)
                        .setColor('RED')
                    ]
                });

                if(StringOption == `${command.name}`){

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setTitle(`🔰 | ¡Información de Comando!`)
                            .setColor('LUMINOUS_VIVID_PINK')
                            .addField("**Comando:**", `\`${command.name}\``)
                            .addField("**Description:**", `\`${command.description}\``)
                            .addField("**Aliases:**", `\`${command.alias || "No Tiene"}\``)
                            .addField("**Uso:**", `\`${command.uso}\``)
                            .addField(`**Categoría**`, `\`${command.category}\``)
                        ]
                    });
                }

            } else {

                const invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`


                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`🔰 | ¡Menú de Ayuda!`)
                        .setDescription(`[Invitación del Bot](${invite})\n\n> **Comandos:**`)
                        .setColor('#C219D8')
                        .setThumbnail(client.user.displayAvatarURL())
                        .setFooter({ text: `Para Obtener Ayuda Para Un Solo Comando Escriba <prefix>help <comando>`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 512, format: 'png' }) })
                        .addFields(
                            {
                                name: '**Queue:**',
                                value: `> \`clear, list, move, remove, shuffle, now_playing, replay, jump, autoplay, volume\``
                            },
                            {
                                name: '**Músic:**',
                                value: '> \`play, skip, stop, pause, resume, filter, search, previous\`'
                            },
                            {
                                name: '**Song:**',
                                value: `> \`addend, forward, rewind, lyrics, seek, join, leave, loop, radio\``
                            },
                            {
                                name: '**Playlist:**',
                                value: '> \`playlist-save, playlist-play, playlist-queue, playlist-delete\`'
                            },
                            {
                                name: '**Filters:**',
                                value: '> \`clear, lightbass, heavybass, bassboost, purebass, 8D, vaporwave, phaser, tremolo, vibrato, reverse, treble, surrounding, pulsator, subboost, karaoke, flanger, gate, haas, mcompand, earrape\`'
                            }
                        )
                    ]
                });

            }

        }

    }
}