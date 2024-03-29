const audit = require("../../utils/audit");
const { SlashCommandBuilder, ChannelType } = require("discord.js");

const SlashBuild = require("../../utils/slash.build");

const body = new SlashCommandBuilder( )
  .addChannelOption((input) => input
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildText)
    .setDescription("channel")
    .setName("channel"))

  .setDescription("audit")
  .setName("auditlogs");

module.exports = new SlashBuild(body, async (interaction) => {
  await interaction.deferReply( );

  const channelOption = interaction.options.get("channel");

  if(!channelOption || !channelOption.channel) {
    return interaction.editReply({ content: "Channel required" })
  };

  if(channelOption.channel.type !== ChannelType.GuildText) {
    return interaction.editReply({ content: "Invalid channel type" });
  };

  audit.cache[interaction.guild.id] = {
    guild: interaction.guild.id,
    channel: channelOption.channel.id,
    logs: [ ]
  };

  audit.save( );

  return interaction.editReply({ content: "<:PanAYAYA:1219689934005473350> Auditlog successfully configured." });
});