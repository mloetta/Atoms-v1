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
    .setName('tempban')
    .setDescription('Temporarily ban a user')
    .addStringOption(option =>
      option.setName('target')
        .setDescription('Which user would you like to temp ban?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('How long should the ban last (e.g., 3d, 2h, 90s)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the temp ban (optional)')
    ),
  async (interaction) => {
    try {
      // Verificar se o usuário que interage tem a permissão de banir membros
      if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
        return interaction.reply({ content: '<a:PanMumumu:1219690061466046524> You do not have the necessary permissions to use this command.', ephemeral: true });
      }

      const target = interaction.options.getUser('target');
      const targetID = target ? target.id : interaction.options.getString('target');
      const duration = interaction.options.getString('duration');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const executor = interaction.user;

      const totalSeconds = parseDuration(duration);

      if (totalSeconds <= 0) {
        return interaction.reply("<a:PanMumumu:1219690061466046524> Invalid duration format provided.");
      }

      const member = interaction.guild.members.cache.get(targetID);

      if (!member) {
        return interaction.reply("<a:PanMumumu:1219690061466046524> User not found in this server.");
      }

      if (member.roles.highest.comparePositionTo(interaction.guild.me.roles.highest) >= 0) {
        return interaction.reply("<a:PanMumumu:1219690061466046524> You cannot ban someone with a role higher than mine.");
      }      

      await member.ban({ reason: reason });

      // Embed construction
      const embed = new EmbedBuilder()
        .setTitle('User Temporarily Banned')
        .setColor("Blurple")
        .addFields(
          { name: 'User', value: `${member.user.tag} (${member.user.id})`, inline: true },
          { name: 'Banned by', value: `${executor.tag} (${executor.id})`, inline: true },
          { name: 'Duration', value: duration, inline: true },
          { name: 'Reason', value: reason, inline: true }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await interaction.guild.members.unban(targetID, 'Temporary ban expired.');
        interaction.followUp(`${member.user.tag} has been unbanned after ${duration}.`);
      }, totalSeconds * 1000);
    } catch (error) {
      console.error(error);
    }
  }
);