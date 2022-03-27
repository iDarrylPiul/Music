module.exports = {
    name: 'ping',
    description: 'Muestra el ping del bot',
    uso: 'ping',
    category: 'Info',
    alias: ['pong'],
    async execute(client, message, args, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, prefix) {

        message.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`Mi Ping Es: ${client.ws.ping} ms!`)
                .setColor('GREEN')
            ]
        });

    }
}