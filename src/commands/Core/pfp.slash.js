const { SlashCommandBuilder, EmbedBuilder, Routes, DataResolver } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

// Substitua 'SEU_ID_DE_USUARIO' pelo ID do seu usuário Discord
const OWNER_ID = '782946852278501407';

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('setpfp')
    .setDescription('Change the bot\'s profile picture.')
    .addAttachmentOption(option =>
      option.setName('pfp')
        .setDescription('The new profile picture.')
        .setRequired(true)
    ),
    async (interaction) => {

    // Verifica se o usuário que interage com o bot é o proprietário
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: "<a:PanMumumu:1219690061466046524> You are not authorized to use this command.", ephemeral: true });
    }

    await interaction.deferReply(); // Adia a resposta inicial

    const { options } = interaction;
    const pfp = options.getAttachment('pfp');

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(message);

      await interaction.editReply({ embeds: [embed], ephemeral: true }); // Edita a resposta inicial com a mensagem final
    }

    if (pfp.contentType !== "image/png" && pfp.contentType !== "image/gif") return await sendMessage(`<:PanNerd:1219689808574550026> Please use a png or gif format for the profile picture.`)

    var error;
    await interaction.client.rest.patch(Routes.user(), {
      body: { avatar: await DataResolver.resolveImage(pfp.url) } // Altera 'banner' para 'avatar'
    }).catch(async err => {
      error = true;
      await sendMessage(`Error: '${err.toString()}'`);
    });

    if (error) return;

    await sendMessage('<:PanAYAYA:1219689934005473350> I have updated the bot\'s profile picture.');

  }
);