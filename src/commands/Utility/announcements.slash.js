const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const SlashBuild = require("../../utils/slash.build");

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Send an announcement in a channel")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Select the channel to send the announcement")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("title")
        .setDescription("Title of the announcement")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("description")
        .setDescription("Description of the announcement")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("color")
        .setDescription("Color of the embed in hexadecimal format")
        .setRequired(false)
    ),

  async (interaction) => {
    await interaction.deferReply({ ephemeral: false });

// Verificar se o usuário possui a permissão de "MANAGE_MESSAGES"
if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
  return interaction.editReply({ content: "<a:PanMumumu:1219690061466046524> You don't have permission to use this command.", ephemeral: true });
}

const channel = interaction.options.getChannel("channel");

// Verifica se o canal é válido e se é um canal de texto ou de anúncio
if (!channel || (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildAnnouncement)) {
    return interaction.editReply({ content: "<:PanNerd:1219689808574550026> Please select a valid text or announcement channel.", ephemeral: true });
}

    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const color = interaction.options.getString("color");
      
    // Constrói o embed
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();

    // Define a cor do embed se fornecida
    if (color) {
      embed.setColor(color);
    }

    // Envia o anúncio
    try {
      await channel.send({ embeds: [embed] });
      await interaction.editReply({ content: "<:PanAYAYA:1219689934005473350> Announcement sent successfully!", ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: "<a:PanMumumu:1219690061466046524> An error occurred while sending the announcement.", ephemeral: true });
    }
  }
);