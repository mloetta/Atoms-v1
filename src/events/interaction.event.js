const EventBuild = require("../utils/event.build");

module.exports = new EventBuild(
  "interaction",
  "interactionCreate",
  async (interaction) => {
    if(interaction.isCommand( )) {
      const name = interaction.commandName;

      if(!name) {
        return interaction.reply({
          content: "You need to inform the command that you want to use.",
          ephemeral: true
        });
      };

      const command = interaction.client.commands.slashes.find((command) => {
        return command.name == name;
      });
  
      if(!command) {
        return interaction.reply({
          content: `Sorry! I couldn't find the command '${name}'.`,
          ephemeral: true
        });
      };
  
      try {
        command.callback(interaction);
      } catch (error) {
        console.log(error);
  
        interaction.reply({
          content: `Sorry! An error occurred while I tried to execute the command.`,
          ephemeral: true
        });
      };

      return;
    };
  }
);