const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const SlashBuild = require('../../utils/slash.build');
const align = require('../../utils/align');

function loadCommandsFromFolder(folderPath) {
  const commands = {};

  function readDirRecursive(folderPath) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        readDirRecursive(fullPath);
      } else {
        if (file.endsWith('.slash.js')) {
          const commandBuild = require(fullPath);
          const { name, description } = commandBuild.body || {};
          const feature = path.basename(folderPath);
          if (name && description) {
            commands[name] = { description, feature, slash: `/${name}` };
          } else {
            console.error(`O arquivo de comando '${file}' não exporta as propriedades necessárias.`);
          }
        }
      }
    }
  }

  readDirRecursive(folderPath);

  return commands;
}

const commandsFolderPath = path.join(__dirname, '../../commands');
const commandInfo = loadCommandsFromFolder(commandsFolderPath);

function commandExists(commandName) {
  return Object.prototype.hasOwnProperty.call(commandInfo, commandName);
}

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Overview of available commands and features')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Enter the name of a command.')
        .setRequired(false)
    ),
  async (interaction) => {
    const input = interaction.options.getString('input');
    const embed = new EmbedBuilder().setColor("Blurple");

    if (input && commandExists(input)) {
      const info = commandInfo[input];
      embed.setTitle(`Command name: ${input}`);
      embed.addFields(
        { name: 'Description', value: `${info.description}`, inline: false },
        { name: 'Usage', value: `\`${info.slash}\``, inline: false }
      );

      await interaction.reply({ embeds: [embed] });

    } else {
      const pages = [
        { 
          title: 'Core commands', 
          content: [
            { name: "help", content: "Displays a list of commands" },
            { name: "ping", content: "Checks the bot's connection to the server" },
            { name: "stats", content: "Provides statistics about the bot" },
            { name: "banner", content: "Changes bot banner" },
            { name: "profile", content: "Changes bot pfp" }
          ], 
          footer: { text: 'Use "/help <command>" to view more information about a command' } 
        },
        { 
          title: 'Information commands', 
          content: [
            { name: "user", content: "Displays information about a user" },
            { name: "docs", content: "Allows accessing documentation for djs" },
            { name: "calc", content: "Performs mathematical calculations" }
          ], 
          footer: { text: 'Use "/help <command>" to view more information about a command' } 
        },
        { 
          title: 'Utility commands', 
          content: [
            { name: "announce", content: "Manages server announcements" },
            { name: "lockdown", content: "Locks down a channel" },
            { name: "purge", content: "Deletes multiple messages" }
          ], 
          footer: { text: 'Use "/help <command>" to view more information about a command' } 
        },
        { 
          title: 'Moderation commands', 
          content: [
            { name: "automod", content: "Enables automated moderation" },
            { name: "audit log", content: "Accesses audit logs" },
            { name: "ban", content: "Bans a user" },
            { name: "kick", content: "Kicks a user" },
            { name: "mute", content: "Mutes a user" },
            { name: "tempmute", content: "Temporarily mutes a user" },
            { name: "tempban", content: "Temporarily bans a user" }
          ], 
          footer: { text: 'Use "/help <command>" to view more information about a command' } 
        }
      ];      

      let currentPage = 0;

      // Função para criar a descrição com Markdown
      const createDescriptionWithMarkdown = (content) => {
        return align({
          sort: "default", // Método de classificação
          tables: content.map(({ name, content }) => ({ 
            name: `\`${name}\``, // Adiciona markdown para bloco de código simples no nome
            content: `${content}`
          })), // Conteúdo das tabelas com markdowns aplicados
          headerAlign: "left", // Alinhamento do cabeçalho (altere para o desejado)
          leftChar: "", // Caractere à esquerda
          rightChar: "" // Caractere à direita
        });
      };

      embed.setTitle(pages[currentPage].title);
      embed.setDescription(createDescriptionWithMarkdown(pages[currentPage].content));
      embed.setFooter(pages[currentPage].footer);

      const actionRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId('previous_page')
            .setEmoji('<:ArrowBackward:1222319816019546172>'),

          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId('next_page')
            .setEmoji('<:ArrowForward:1222319802874593290>')
        );

      const message = await interaction.reply({ embeds: [embed], components: [actionRow] });

      const filter = (buttonInteraction) => {
        return buttonInteraction.user.id === interaction.user.id;
      };

      const collector = message.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (buttonInteraction) => {
        if (buttonInteraction.customId === 'previous_page' && currentPage > 0) {
          currentPage--;
        } else if (buttonInteraction.customId === 'next_page' && currentPage < pages.length - 1) {
          currentPage++;
        }

        embed.setTitle(pages[currentPage].title);
        embed.setDescription(createDescriptionWithMarkdown(pages[currentPage].content));

        await buttonInteraction.update({ embeds: [embed], components: [actionRow] });
      });

      collector.on('end', () => {
        message.edit({ components: [] });
      });
    }
  }
);