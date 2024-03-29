// ping.slash.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const SlashBuild = require("../../utils/slash.build");

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Calculates bot latency"),

  async (interaction) => {
    try {
      await interaction.deferReply({ ephemeral: false });

      const restLatency = interaction.client.ws.ping;
      const gatewayLatency = Date.now() - interaction.createdTimestamp;

      const color = restLatency < 100 ? "#00FF00" : "#FF0000";

      const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(
          `**Pong!**\n\`\`\`ansi\nRest: \x1b[35m${restLatency}ms\x1b[0m\nGateway: \x1b[35m${gatewayLatency}ms\x1b[0m\`\`\``
        )
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: '<a:RyoMumumu:1219690061466046524> Error calculating bot latency.',
        ephemeral: true,
      });
    }
  }
);