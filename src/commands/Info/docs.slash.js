const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const SlashBuild = require('../../utils/slash.build');
const puppeteer = require("puppeteer");

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('docs')
    .setDescription('Query the discord.js docs')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The thing to search for')
        .setRequired(true)
    ),
  async interaction => {
    const { options } = interaction;
    let query = options.getString('query');
    await interaction.deferReply({ ephemeral: true });

    query = query.replace(' ', '%20');

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      const openURL = `https://old.discordjs.dev/#/docs/discord.js/14.11.0/search?query=${query}`;
      await page.goto(openURL);

      await page.waitForSelector('div > ul.no-list');

      const values = await page.evaluate(() => {
        const div = document.querySelector('div > ul.no-list');
        const listItems = div.querySelectorAll('li');
      
        return Array.from(listItems).map(li => {
          const anchor = li.querySelector('a');
          if (anchor) {
            const text = anchor.innerText.trim();
            const link = `https://old.discordjs.dev${anchor.getAttribute('href')}`;
            return { text, link };
          }
          return null;
        }).filter(Boolean); // Remove os valores nulos do array resultante
      });        
          
      if (values.length <= 1) {
        return await interaction.editReply({ content: `No documentation found matching query \`${query}\`` });
      }

      async function getValues(num) {
        const output = values.slice(0, num);
        const format = output.map(item => `[${item.text}](${item.link})\n`);
        return format;
      }

      const button = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Load more')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('djsload'),

          new ButtonBuilder()
            .setLabel('Full list')
            .setStyle(ButtonStyle.Link)
            .setURL(openURL)
        );

      query = query.replace('%20', ' ');
      const finalOutput = await getValues(10);
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Discord.js documentation query "${query}"`)
        .setDescription(finalOutput.join(''))
        .setFooter({ text: `Loaded 10 values` });

      const msg = await interaction.editReply({ embeds: [embed], components: [button] });
      const collector = msg.createMessageComponentCollector();

      var num = 20;
      collector.on('collect', async i => {
        if (i.customId == 'djsload') {
          if (num >= 40) {
            return await i.reply({ content: `I can't load anymore values.`, ephemeral: true });
          }

          const newOutput = await getValues(num);
          embed.setDescription(newOutput.join(''));
          embed.setFooter({ text: `Loaded ${num} values` });
          await i.reply({ content: `Loaded 10 more values.`, ephemeral: true });

          num += 10;
          await interaction.editReply({ embeds: [embed], components: [button] });
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while processing your request.' });
    } finally {
      await browser.close();
    }
  }
);