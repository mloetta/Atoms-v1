require("dotenv/config");

const { GatewayIntentBits, Client, Partials } = require("discord.js");

const eventHandler = require("./handles/event.handler");
const commandHandler = require("./handles/command.handler");

const pan = new Client({
  intents: [
    // GUILD BITS //
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,

    // MESSAGE BITS //
    GatewayIntentBits.GuildMessageReactions,

    // DIRECT MESSAGE BITS //
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel] // Adicionando partial para obter partes específicas de canais
});

pan.events = eventHandler(`${__dirname}/events`);
pan.commands = commandHandler(`${__dirname}/commands`);

pan.events.forEach((event) => {
  console.log('Event type:', event.type);
  console.log('Event callback:', event.callback);
  if (typeof event.callback === 'function') {
    pan.on(event.type, event.callback);
  } else {
    console.error('Callback is not a function for event type:', event.type);
  }
});

pan.login(process.env.CLIENT_TOKEN);