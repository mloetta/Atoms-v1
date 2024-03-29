const { SlashCommandBuilder, EmbedBuilder, Routes, DataResolver } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

const OWNER_ID = '782946852278501407';

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('setbanner')
    .setDescription('Add a banner to your bot.')
    .addAttachmentOption(option =>
      option.setName('banner')
        .setDescription('The banner to be added.')
        .setRequired(true)
    ),
    async (interaction) => {

      // Verifica se o usuário que interage com o bot é o proprietário
      if (interaction.user.id !== OWNER_ID) {
        return interaction.reply({ content: "<a:PanMumumu:1219690061466046524> You are not authorized to use this command.", ephemeral: true });
      }  

    await interaction.deferReply(); // Adia a resposta inicial

    const { options } = interaction;
    const banner = options.getAttachment('banner');

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(message);

      await interaction.editReply({ embeds: [embed], ephemeral: true }); // Edita a resposta inicial com a mensagem final
    }

    if (banner.contentType !== "image/gif" && banner.contentType !== "image/png") return await sendMessage(`<:PanNerd:1219689808574550026> Please use a gif or png format for banners.`)

    var error;
    await interaction.client.rest.patch(Routes.user(), {
      body: { banner: await DataResolver.resolveImage(banner.url) }
    }).catch(async err => {
      error = true;
      await sendMessage(`Error: '${err.toString()}'`);
    });

    if (error) return;

    await sendMessage('<:PanAYAYA:1219689934005473350> I have uploaded your banner.');

  }
);