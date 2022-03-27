const Discord = require('discord.js')
const client = require('./client')
const { Collection } = require("discord.js")

client.commands = new Collection();
client.events = new Collection();
client.slash = new Collection();
filtros = require("./config/filters.json");
client.config = require('./config/config.json');

["commandHandler", "eventHandler", "slashHandler", "distubeEventos", "antiCrash", "base"].forEach((file) => {
  require(`./handlers/${file}`)(client, Discord);
});

client.login(client.config.token);