module.exports = {
    name: 'queue',
    description: 'Muestra la Cola',
    uso: 'queue',
    category: 'Queue',
    alias: ['q', 'lista', 'list'],
    async execute(client, message, args, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, prefix) {
        
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

        let listaqueue = [];

        var maximascanciones = 10;

        const xd = queue.songs.length - 1;

        for (let i = 0; i < queue.songs.length; i += maximascanciones) {
            let canciones = queue.songs.slice(i, i + maximascanciones)
            listaqueue.push(canciones.map((cancion, index) => `**__\`${i + index}\`__** - [\`${cancion.name}\`](${cancion.url})`).join('\n'));
        }

        var limite = listaqueue.length;

        var embeds = []

        for(let i = 0; i < limite; i++){
            let desc = String(listaqueue[i]).substring(0, 2048)
            let embed = new MessageEmbed()
            .setTitle(`🎶 Cola de ${message.guild.name} - \`[${queue.songs.length - 1} ${queue.songs.length - 1 > 1 ? "Canciónes" : "Canción"}]\``)
            .setColor("#8400ff")
            .setDescription(desc);
            if(queue.songs.length > 1) embed.addField(`💿 Canción Actual`, `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**`);

            await embeds.push(embed);
        }
        return paginacion();

        async function paginacion(){
            let paginaActual = 0;

            if(embeds.length === 1) return message.reply({
                embeds: [embeds[0]]
            }).catch(() => {})

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("Atrás")
                .setEmoji("929001012176507040")
                .setLabel("Atrás"),
                new MessageButton()
                .setStyle("DANGER")
                .setCustomId("Inicio")
                .setEmoji("🏠")
                .setLabel("Inicio"),
                new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("Avanzar")
                .setEmoji("929001012461707335")
                .setLabel("Avanzar")
            );

            let embedpaginas = await message.channel.send({
                content: `**Haz click en los __Botones__ para cambiar de páginas**`,
                embeds: [embeds[0].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })],
                components: [row]
            });

            const ifilter = i => i.user.id == message.author.id;

            const collector = message.channel.createMessageComponentCollector({
                filter: ifilter,
                time: 180e3
            });

            collector.on('collect', async (b) => {
                if(b?.user.id !== message.author.id) return b?.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`${client.config.error} | ¡Solo la Persona Que Escribio El Comando Puede Interactuar Con los Comandos!`)
                        .setColor('RED')
                    ]
                });

                switch (b?.customId) {
                    case "Atrás": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        if (paginaActual !== 0) {
                            //Resetemamos el valor de pagina actual -1
                            paginaActual -= 1
                            //Editamos el embeds
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        } else {
                            //Reseteamos al cantidad de embeds - 1
                            paginaActual = embeds.length - 1
                            //Editamos el embeds
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    case "Inicio": {
                        //Resetemamos el tiempo del collector
                        collector.resetTimer();
                        //Si la pagina a retroceder no es igual a la primera pagina entonces retrocedemos
                        paginaActual = 0;
                        await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                        await b?.deferUpdate();
                    }
                        break;

                    case "Avanzar": {
                        collector.resetTimer();
                        if (paginaActual < embeds.length - 1) {
                            paginaActual++
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        } else {
                            paginaActual = 0
                            await embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [embedpaginas.components[0]] }).catch(() => { });
                            await b?.deferUpdate();
                        }
                    }
                        break;

                    default:
                        break;
                }
            });

            collector.on('end', async () => {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                row.components[2].setDisabled(true);

                embedpaginas.edit({ embeds: [embeds[paginaActual].setFooter({ text: `Pagina ${paginaActual + 1} / ${embeds.length}` })], components: [row] })
            });

        }

    }
}