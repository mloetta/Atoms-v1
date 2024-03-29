const { ChannelType } = require("discord.js");
const EventBuild = require("../utils/event.build");

// Map para armazenar o horário da última mensagem de cada usuário
const cooldowns = new Map();

module.exports = new EventBuild(
  "messageCreate",
  "messageCreate",
  async (message) => {
    // Ignore messages sent by the bot itself
    if (message.author.bot) return;

    // Verifica se a mensagem foi enviada em um canal de DM
    if (message.channel.type === ChannelType.DM) {
      // Obtém o horário atual
      const now = Date.now();

      // Verifica se o usuário está no cooldown
      if (cooldowns.has(message.author.id)) {
        // Obtém o horário da última mensagem do usuário
        const userCooldown = cooldowns.get(message.author.id);

        // Calcula o tempo decorrido desde a última mensagem
        const elapsedTime = now - userCooldown;

        // Verifica se o cooldown ainda está ativo (menos de uma hora)
        if (elapsedTime < 3600000) { // 1 hora em milissegundos
          // Não responde à mensagem devido ao cooldown
          return;
        }
      }

      // Se não estiver no cooldown, responde à mensagem
      await message.reply('<a:RyoMumumu:1219690061466046524> Sorry, I don\'t work in DMs yet.');

      // Armazena o horário da última mensagem do usuário
      cooldowns.set(message.author.id, now);
    }
  }
);