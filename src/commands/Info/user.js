const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('user')
    .setDescription('Displays information about a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Which user would you like to get information about?')
        .setRequired(true)
    ),

  async (interaction) => {
    // Defer the reply initially
    await interaction.deferReply();

    const user = interaction.options.getUser('target');

    // Check if the user exists
    if (!user) {
      return interaction.editReply('User not found.');
    }

    // Fetch the user to ensure all information is up to date
    await user.fetch();

    // Construct the embed
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`@${user.username} (${user.id})`)
      .setThumbnail(user.avatarURL())
      .setImage(user.bannerURL({ size: 4096 })) // Set banner image directly without specifying format

      // Add user info fields
      .addFields(
        { name: 'Dates', value: `Account Created: <t:${Math.floor(user.createdAt.getTime() / 1000)}:d>\nJoined Guild: <t:${Math.floor(interaction.guild.members.cache.get(user.id).joinedAt.getTime() / 1000)}:d>`, inline: false }
      );

    // Map badges to emojis
    const badgeEmojis = {
      Partner: '<:Partner:1216196243378671716>',
      BugHunterLevel1: '<:BugHunter:1216196179457605783>',
      BugHunterLevel2: '<:BugHunter2:1216196188727152731>',
      HypesquadEvents: '<:Hypesquad:1216196231861113015>',
      HypeSquadOnlineHouse1: '<:Bravery:1216196158792138894>',
      HypeSquadOnlineHouse2: '<:Brilliance:1216196169894723654>',
      HypeSquadOnlineHouse3: '<:Balance:1216196146435723415>',
      PremiumEarlySupporter: '<:EarlySupporter:1217982981814353960>',
      VerifiedDeveloper: '<:VerifiedDev:1216196274643009636>',
      ActiveDeveloper: '<:Activedev:1216196133211078666>',
      Nitro: '<:Nitro:1218312755665309748>', // Added Nitro badge emoji
    };

    // Check if the user has a banner
    const hasBanner = user.banner !== null && user.banner !== undefined;

    // Create an array to store badges
    const userBadges = [];

    // Push existing badges to the array
    user.flags.toArray().forEach(flag => {
      userBadges.push(flag);
    });

    // Push Nitro badge if the user has a banner
    if (hasBanner) {
      userBadges.push('Nitro');
    }

    // Check if the user has any badges
    if (userBadges.length > 0) {
      const badges = userBadges.map(flag => badgeEmojis[flag]).join('');
      embed.addFields(
        { name: 'Badges', value: badges, inline: false },
      );
    } else {
      embed.addFields(
        { name: 'Badges', value: 'None', inline: true },
      );
    }

    // Send the embed as a reply
    await interaction.editReply({ embeds: [embed] });
  }
);