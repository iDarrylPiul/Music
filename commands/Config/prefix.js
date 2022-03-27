const serverSchema = require("../../models/serverSchema");

module.exports = {
    name: 'prefix',
    description: 'Cambia el Prefijo del Bot',
    uso: 'prefix <prefix>',
    category: 'Config',
    alias: ['set-prefix', 'prefix-set'],
    async execute(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton) {

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Este Comando Solo Esta Disponible Para Slash!`)
                .setColor('RED')
            ]
        });

    }
}