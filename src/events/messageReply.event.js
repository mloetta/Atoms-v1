// Definindo um mapa para rastrear o tempo da última mensagem de cada usuário
const lastMessageTime = new Map();

// Definindo o cooldown em milissegundos (5 minutos)
const cooldownDuration = 5 * 60 * 1000;

// messageCreate.event.js
const EventBuild = require("../utils/event.build");

module.exports = new EventBuild(
  "messageCreate",
  "messageCreate",
  async (message) => {
    // Verifica se a mensagem foi enviada pelo bot ou se não contém a palavra "cmt"
    if (message.author.bot || !message.content.toLowerCase().includes("cmt")) {
      return; // Ignora a mensagem se foi enviada pelo bot ou não contém "cmt"
    }

    // Define o ID do usuário específico que pode ativar a resposta
    const specificUserID = "614843678262820903";

    // Verifica se a mensagem foi enviada pelo usuário específico
    if (message.author.id !== specificUserID) {
      return; // Ignora a mensagem se não foi enviada pelo usuário específico
    }

    // Verifica se o usuário está dentro do cooldown
    if (lastMessageTime.has(specificUserID)) {
      const lastMessageTimestamp = lastMessageTime.get(specificUserID);
      const currentTime = Date.now();
      const timeDifference = currentTime - lastMessageTimestamp;

      if (timeDifference < cooldownDuration) {
        // Se ainda estiver dentro do cooldown, não responda e retorne
        return;
      }
    }

    // Registra o tempo da última mensagem do usuário
    lastMessageTime.set(specificUserID, Date.now());

    // Responde à mensagem com uma resposta engraçada
    message.reply('CMT?? Omg, that was so calamitous!!!!!!!!');
  }
);