const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lockdown all channels'),

  async (interaction) => {
    try {
      // Verificar se o usuário tem as permissões necessárias para gerenciar canais
      if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: '<a:PanMumumu:1219690061466046524> You do not have the necessary permissions to use this command.', ephemeral: true });
      }

      // Buscar todos os canais do servidor
      const channels = interaction.guild.channels.cache;

      // Travar todos os canais de texto
      channels.filter(channel => !channel || (channel.type !== ChannelType.GuildText)).forEach(async (channel) => {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          SendMessage: false
        });
      });

      // Travar todos os canais de voz
      channels.filter(channel => channel.type !== ChannelType.GuildVoice).forEach(async (channel) => {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          Speak: false
        });
      });

      interaction.reply('<:PanUwu:1219689895618940928> Lockdown initiated. Channels are now locked.');
    } catch (error) {
      console.error(error);
    }
  }
);