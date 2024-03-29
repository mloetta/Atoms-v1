const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Unmutes a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Which user would you like to unmute?')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the unmute (optional)')
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
    
        // Desmutar o usuário
        await member.timeout(null);
        const reason = interaction.options.getString('reason');
    
        // Construção do Embed
        const embed = new EmbedBuilder()
          .setTitle('User Unmuted')
          .setColor("Blurple")
          .addFields(
            { name: 'User', value: `${target.tag} (${target.id})` },
            { name: 'Reason', value: reason || 'No reason provided' }
          )
          .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
      }
    }    
);