const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Which user would you like to kick?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick (optional)')
    ),
  async (interaction) => {
    try {
      // Verificar se o usuário que interage tem a permissão de expulsar membros
      if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
        return interaction.reply({ content: '<a:PanMumumu:1219690061466046524> You do not have the necessary permissions to use this command.', ephemeral: true });
      }

      let target = interaction.options.getUser('target');
      if (!target) {
        // Se o alvo não for uma menção de usuário, tenta encontrar por ID
        const userId = interaction.options.getString('target');
        if (!userId) {
          return interaction.reply("<a:PanMumumu:1219690061466046524> Invalid user provided.");
        }
        target = await interaction.client.users.fetch(userId);
        if (!target) {
          return interaction.reply("<a:PanMumumu:1219690061466046524> User not found.");
        }
      }

      const reason = interaction.options.getString('reason') || 'No reason provided';
      const executor = interaction.user;

      const member = interaction.guild.members.cache.get(target.id);

      if (!member) {
        return interaction.reply("<a:PanMumumu:1219690061466046524> User not found in this server.");
      }

      if (member.roles.highest.comparePositionTo(interaction.guild.me.roles.highest) >= 0) {
        return interaction.reply("<a:PanMumumu:1219690061466046524> You cannot kick someone with a role higher than mine.");
      }      

      await member.kick(reason);

      // Embed construction
      const embed = new EmbedBuilder()
        .setTitle('User Kicked')
        .setColor("Blurple")
        .addFields(
          { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
          { name: 'Kicked by', value: `${executor.tag} (${executor.id})`, inline: true },
          { name: 'Reason', value: reason, inline: true }
        )
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  }
);