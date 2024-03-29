const { SlashCommandBuilder } = require('discord.js');
const math = require('mathjs');
const SlashBuild = require('../../utils/slash.build');

module.exports = new SlashBuild(
  new SlashCommandBuilder()
    .setName('calculate')
    .setDescription('Solves a mathematical expression or equation')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('Enter the expression or equation to be solved')
        .setRequired(true)),
  async (interaction) => {
    const expression = interaction.options.getString('expression');

    try {
      const result = math.evaluate(expression); // Evaluates the provided expression or equation using the mathjs library

      await interaction.reply(`<:PanNerd:1219689808574550026> The result of "${expression}" is: ${result}`);
    } catch (error) {
      await interaction.reply('<a:PanMumumu:1219690061466046524> An error occurred while solving the expression or equation. Make sure the input provided is valid.');
      console.error(error);
    }
  }
);