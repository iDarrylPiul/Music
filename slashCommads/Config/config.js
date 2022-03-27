const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const serverSchema = require('../../models/serverSchema')

module.exports = {
    name: "config",
    description: "Comandos Config",
    options: [
        {
            name: 'prefix',
            description: 'Cambia El Prefijo Del Servidor!',
            type: 1,
            options: [{ name: 'prefijo', description: 'Escriba Un Prefijo', type: 'STRING', required: true }]
        },
    ],
    Permissions: ['ADMINISTRATOR'],
    run: async (client, interaction, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, canalmusica) => {

        const { guild, guildId, member, options } = interaction;

        if(options.getSubcommand() === 'prefix'){
            let prefix = options.getString('prefijo')

            let server = await serverSchema.findOne({ guildId });

            if(server){
                serverSchema.findOneAndUpdate({ guildId }, { prefix })
                .exec()
                .catch(console.log)
            } else {
                serverSchema.create({
                    guildId: guild.id,
                    guildName: guild.name,
                    prefix: "+"
                });
            }

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.done} | Prefijo Actualizado Por \`${prefix}\``)
                    .setColor('GREEN')
                ]
            })
        }

    }
}