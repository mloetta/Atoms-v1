const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

function parseDuration(duration) {
  const regex = /^(\d+)([dDhHmMsS])$/;
  const match = duration.match(regex);

  if (!match) {
    return 0;
  }

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'd':
      return value * 24 * 60 * 60;
    case 'h':
      return value * 60 * 60;
    case 'm':
      return value * 60;
    case 's':
      return value;
    default:
      return 0;
  }
}

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Mutes a user for a specified duration')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Which user would you like to mute?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('How long should the mute last (e.g., 3d, 2h, 90s)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute (optional)')
    ),
  async (interaction) => {
    try {
      const target = interaction.options.getUser('target');
      const member = interaction.guild.members.cache.get(target.id);

      if (!member) {
        return interaction.reply("<a:RyoMumumu:1219690061466046524> User not found in this server.");
      }

      // Verificar se o usuário que interage tem a permissão de ModerateMembers
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '<a:RyoMumumu:1219690061466046524> You do not have the necessary permissions to use this command.', ephemeral: true });
      }
      
      const totalSeconds = parseDuration(interaction.options.getString('duration'));

      if (totalSeconds <= 0) {
        return interaction.reply("<a:RyoMumumu:1219690061466046524> Invalid duration format provided.");
      }

      await member.timeout(totalSeconds * 1000);

      const embed = new EmbedBuilder()
        .setTitle('User Muted')
        .setColor("Blurple")
        .setDescription(`${target.tag} has been muted for ${interaction.options.getString('duration')}.`)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await member.timeout(null);
        interaction.followUp(`${target.tag} has been unmuted after ${interaction.options.getString('duration')}.`);
      }, totalSeconds * 1000);
    } catch (error) {
      console.error(error);
    }
  }
);