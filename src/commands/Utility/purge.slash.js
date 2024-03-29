const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete a specific number of messages')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete')
        .setRequired(true)
    ),
  
  async (interaction) => {
    try {
      // Check if the user has the necessary permissions to manage messages
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({ content: '<a:PanMumumu:1219690061466046524> You do not have the necessary permissions to use this command.', ephemeral: true });
      }

      // Get the amount of messages to delete from the user's input
      const amount = interaction.options.getInteger('amount');

      // Check if the amount is within a valid range
      if (amount <= 0 || amount > 100) {
        return interaction.reply('<:PanNerd:1219689808574550026> Please provide a valid number of messages to delete (1-100).');
      }

      // Fetch and delete the specified number of messages
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      await interaction.channel.bulkDelete(messages);

      // Embed construction
      const embed = new EmbedBuilder()
        .setTitle('Purge Successful')
        .setColor("Blurple")
        .setDescription(`Successfully deleted ${amount} messages.`)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);

      // Embed construction for error
      const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setColor("Blurple")
        .setDescription('<a:PanMumumu:1219690061466046524> An error occurred while trying to delete messages.')
        .setTimestamp();

      interaction.reply({ embeds: [errorEmbed] });
    }
  }
);