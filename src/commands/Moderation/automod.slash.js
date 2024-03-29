const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Setup the automod system')
    .addSubcommand(subcommand => subcommand.setName('flagged-words').setDescription('Block profanity, sexual content, and slurs.'))
    .addSubcommand(subcommand => subcommand.setName('spam-messages').setDescription('Block messages suspected of spam.'))
    .addSubcommand(subcommand => subcommand.setName('mention-spam').setDescription('Block messages containing a certain amount of mentions.')
      .addIntegerOption(option => option.setName('number').setDescription('The number of mentions required to block a message.').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('keyword').setDescription('Block a given keyword in the server.')
      .addStringOption(option => option.setName('word').setDescription('The word that you want to block.').setRequired(true))),
  async (interaction) => {
    const { guild, options } = interaction;
    const sub = options.getSubcommand();

    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '<a:PanMumumu:1219690061466046524> You do not have the necessary permissions to use this command.', ephemeral: true });
    }       

    switch (sub) {
      case 'flagged-words':
        await interaction.reply({ content: '<:PanMoffster:1219690048245727232> Loading your automod rule.' });

        const rule = await guild.autoModerationRules.create({
          name: 'Block profanity, sexual content, and slurs by Pan\'s automod.',
          creatorId: '782946852278501407',
          enabled: true,
          eventType: 1,
          triggerType: 4,
          triggerMetadata: {
            presets: [1, 2, 3],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                duractionSeconds: 10,
                customMessage: 'This message was prevented by Pan\'s automod.',
              },
            },
          ],
        }).catch(async (err) => {
          setTimeout(async () => {
            console.log(err);
            await interaction.editReply({ content: `${err}` });
          }, 2000);
        });

        setTimeout(async () => {
          if (!rule) return;

          const embed = new EmbedBuilder().setColor('#baffca').setDescription('<:PanAYAYA:1219689934005473350> Your automod rule has been created- all swears will be stopped by Pan\'s automod.');

          await interaction.editReply({ content: '', embeds: [embed] });
        }, 3000);

        break;

      case 'keyword':
        await interaction.reply({ content: '<:PanMoffster:1219690048245727232> Loading your automod rule.' });
        const word = options.getString('word');

        const rule2 = await guild.autoModerationRules.create({
          name: `Prevent the word ${word} from being used by Pan\'s automod.`,
          creatorId: '782946852278501407',
          enabled: true,
          eventType: 1,
          triggerType: 1,
          triggerMetadata: {
            keywordFilter: [word],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                duractionSeconds: 10,
                customMessage: 'This message was prevented by Pan\'s automod.',
              },
            },
          ],
        }).catch(async (err) => {
          setTimeout(async () => {
            console.log(err);
            await interaction.editReply({ content: `${err}` });
          }, 2000);
        });

        setTimeout(async () => {
          if (!rule2) return;

          const embed2 = new EmbedBuilder().setColor('#baffca').setDescription(`<:PanAYAYA:1219689934005473350> Your automod rule has been created- all messages containing the word ${word} will be deleted by Pan\'s automod.`);

          await interaction.editReply({ content: '', embeds: [embed2] });
        }, 3000);

        break;

      case 'spam-messages':
        await interaction.reply({ content: '<:PanMoffster:1219690048245727232> Loading your automod rule.' });
        // const number = options.getString('number'); // Uncomment this line if you plan to use 'number' from options

        const rule3 = await guild.autoModerationRules.create({
          name: 'Prevent spam messages by Pan\'s automod.',
          creatorId: '782946852278501407',
          enabled: true,
          eventType: 1,
          triggerType: 3,
          triggerMetadata: {
            // mentionTotalLimit: number
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                duractionSeconds: 10,
                customMessage: 'This message was prevented by Pan\'s automod.',
              },
            },
          ],
        }).catch(async (err) => {
          setTimeout(async () => {
            console.log(err);
            await interaction.editReply({ content: `${err}` });
          }, 2000);
        });

        setTimeout(async () => {
          if (!rule3) return;

          const embed3 = new EmbedBuilder().setColor('#baffca').setDescription('<:PanAYAYA:1219689934005473350> Your automod rule has been created- all messages suspected of spam will be stopped by Pan\'s automod.');

          await interaction.editReply({ content: '', embeds: [embed3] });
        }, 3000);

        break;

      case 'mention-spam':
        await interaction.reply({ content: '<:PanMoffster:1219690048245727232> Loading your automod rule.' });
        const number = options.getInteger('number');

        const rule4 = await guild.autoModerationRules.create({
          name: 'Prevent spam mentions by Pan\'s automod.',
          creatorId: '782946852278501407',
          enabled: true,
          eventType: 1,
          triggerType: 5,
          triggerMetadata: {
            mentionTotalLimit: number,
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel,
                duractionSeconds: 10,
                customMessage: 'This message was prevented by Pan\'s automod.',
              },
            },
          ],
        }).catch(async (err) => {
          setTimeout(async () => {
            console.log(err);
            await interaction.editReply({ content: `${err}` });
          }, 2000);
        });

        setTimeout(async () => {
          if (!rule4) return;

          const embed4 = new EmbedBuilder().setColor('#baffca').setDescription('<:PanAYAYA:1219689934005473350> Your automod rule has been created- all messages suspected of spam will be stopped by Pan\'s automod.');

          await interaction.editReply({ content: '', embeds: [embed4] });
        }, 3000);
    }
  }
);