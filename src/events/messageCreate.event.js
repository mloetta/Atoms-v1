// messageCreate.event.js
const EventBuild = require("../utils/event.build");

// Map para armazenar o tempo da última mensagem de cada usuário
const userCooldowns = new Map();

module.exports = new EventBuild(
  "messageCreate",
  "messageCreate",
  async (message) => {
    // Verifica se a mensagem foi enviada pelo bot
    if (message.author.bot) return;

    // Verifica se a mensagem contém menções diretas ao bot
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser && mentionedUser.id === message.client.user.id) {
      // Verifica se o usuário está em cooldown
      if (userCooldowns.has(message.author.id)) {
        const lastMessageTime = userCooldowns.get(message.author.id);
        const elapsedTime = Date.now() - lastMessageTime;
        const remainingTime = 5 * 60 * 1000 - elapsedTime;

        // Verifica se o cooldown ainda está ativo
        if (remainingTime > 0) {
          // Se estiver em cooldown, apenas retorne sem responder à menção
          return;
        }
      }

      // Define o tempo atual como o último tempo de mensagem do usuário
      userCooldowns.set(message.author.id, Date.now());

      // Responde à menção com uma mensagem
      message.reply('<:RyoSmile:1219689870323224596> Greetings! Do you need my assistance?');
    }
  }
);