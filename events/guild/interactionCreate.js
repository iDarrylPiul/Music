const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js');
const cooldown = new Set()

module.exports = async (client, Discord, interaction) => {

try {

    if(interaction.isCommand()) {

        if(interaction.channel === null) return interaction.followUp({
            embeds: [
                new MessageEmbed()
                .setDescription(`${client.config.error} | ¡Los Comandos No Estan Disponibles En Mensajes Privados!`)
                .setColor('RED')
            ]
        });

        const args = [];

        for (let option of interaction.options.data){
            if(option.type === 'SUB_COMMAND'){
                if(option.name) args.push(option.name)
                option.options?.forEach((x) => {
                    if(x.value) args.push(x.value)
                });
            } else if (option.value) args.push(option.value);
        }

        const command = client.slash.get(interaction.commandName);

        if(!interaction.guild.me.permissions.has(command.BotPermissions || [])) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡Necesito Permisos Para Ejecutar Ese Comando!`)
                    .setColor('RED')
                ]
            });
        }

        if(!interaction.member.permissions.has(command.Permissions || [])) {
            return interaction.followUp({
                embeds: [
                    new MessageEmbed()
                    .setDescription(`${client.config.error} | ¡Necesitas Permisos Para Ejecutar El Comando!`)
                    .setColor('RED')
                ]
            });
        }

        const canalmusica = interaction.member.voice.channel;
        
        command.run(client, interaction, args, MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu, canalmusica)

        if(command.cooldown){
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
        }

    }

} catch (e) {
    console.log(e)
}

    
}