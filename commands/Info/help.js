module.exports = {
    name: 'help',
    description: 'Muestra El Menú De Ayuda',
    uso: 'help <comando>',
    category: 'Info',
    alias: ['ayuda'],
    async execute(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, prefix) {

        if(args[0] && args[0].length > 0) {

            const cmd = args[0].toLowerCase();

            const command = client.commands.get(cmd) || client.commands.find((a) => a.alias && a.alias.includes(cmd))
        
            if(command == undefined) return message.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡No Encontre El Comando \`${args.join(' ')}\`!`)
                    .setColor('RED')
                ]
            });
    
            if(args[0] === `${command.name}`){
                message.reply({
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

            message.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`🔰 | ¡Menú de Ayuda!`)
                    .setDescription(`[Invitación del Bot](${invite})\n\n> **Comandos:**`)
                    .setColor('#C219D8')
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({ text: `Para Obtener Ayuda Para Un Solo Comando Escriba <prefix>help <comando>`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 512, format: 'png' }) })
                    .addFields(
                        {
                            name: '**Config:**',
                            value: `> \`prefix\``
                        },
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