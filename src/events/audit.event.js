const { EmbedBuilder } = require("discord.js");
const audit = require("../utils/audit");
const EventBuild = require("../utils/event.build");

function submitAudit(channel, content) {
  channel.send({ embeds: [content] });
}

function resolveEvent(guild, content) { 
  const data = audit.cache[guild.id];
  if (!data || !data.channel) return;
  
  guild.channels.fetch(data.channel)
    .then((channel) => submitAudit(channel, content))
    .catch((error) => {
      console.error(error);
      console.error("Failed to submit audit");
    });
}

module.exports = new EventBuild("log", "ready", (client) => {
  console.log("AuditLog");

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("messageDelete", (message) => {
    if (message.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Message Deleted")
        .setDescription(`A message was deleted in ${message.guild.name}`)
        .addFields(
          { name: 'Author', value: message.author.tag, inline: false },
          { name: 'Content', value: message.content, inline: false },
        )
        .setTimestamp();
 
    resolveEvent(message.guild, embed);
  });

  client.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.author.bot || newMessage.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Message Updated")
        .setDescription(`A message was updated in ${oldMessage.guild.name}`)
        .addFields(
          { name: 'Author', value: oldMessage.author.tag, inline: false },
          { name: 'Before', value: oldMessage.content, inline: false },
          { name: 'After', value: newMessage.content, inline: false },
        )
        .setTimestamp();
 
    resolveEvent(oldMessage.guild, embed);
  });

  client.on("emojiCreate", (emoji) => {
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Emoji Created")
        .setDescription(`An emoji "${emoji.name}" was created in ${emoji.guild.name}`)
        .setThumbnail(emoji.url) // Usar url para obter a URL do emoji
        .setTimestamp();
 
    resolveEvent(emoji.guild, embed);
  });
 
  client.on("emojiDelete", (emoji) => {
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Emoji Deleted")
        .setDescription(`An emoji "${emoji.name}" was deleted in ${emoji.guild.name}`)
        .setThumbnail(emoji.url) // Usar url para obter a URL do emoji
        .setTimestamp();
 
    resolveEvent(emoji.guild, embed);
  });
 
  client.on("emojiUpdate", (oldEmoji, newEmoji) => {
    const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Emoji Updated")
        .setDescription(`An emoji "${oldEmoji.name}" was updated in ${oldEmoji.guild.name}`)
        .addFields(
          { name: 'Before', value: oldEmoji.name, inline: false },
          { name: 'After', value: newEmoji.name, inline: false },
        )
        .setThumbnail(oldEmoji.url) // Usar url para obter a URL do emoji
        .setTimestamp();
 
    resolveEvent(oldEmoji.guild, embed);
  });

client.on("roleUpdate", (oldRole, newRole) => {
  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle("Role Updated")
    .setDescription(`A role was updated in ${oldRole.guild.name}`)
    .setTimestamp();

  let description = "";

  // Verificar se houve alteração de nome
  if (oldRole.name !== newRole.name && oldRole.color === newRole.color) {
    description += `The name of the role ${oldRole.toString()} was updated.\n`;
      embed.addFields(
        { name: 'Old Name', value: oldRole.name, inline: true },
        { name: 'New Name', value: newRole.name, inline: true }
      );
  }

  // Verificar se houve alteração na cor do cargo
  if (oldRole.color !== newRole.color) {
    description += `The color of the role "${oldRole.name}" was updated.\n`;
    embed.addFields(
      { name: 'Before', value: oldRole.hexColor, inline: false },
      { name: 'After', value: newRole.hexColor, inline: false }
    );
  }

  // Verificar se houve alteração de nome ou de cor
  if (description) {
    embed.setDescription(description);

    resolveEvent(oldRole.guild, embed);
  }
});

  client.on("roleDelete", (role) => {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Role Deleted")
      .setDescription(`A role was deleted in ${role.guild.name}`)
      .addFields(
        { name: 'Author', value: role.guild.me.user.tag, inline: false },
        { name: 'Role', value: `${role.name} (${role.id})`, inline: false },
      )
      .setTimestamp();
  
    resolveEvent(role.guild, embed);
  });

  client.on("roleCreate", (role) => {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Role Created")
      .setDescription(`A role was created in ${role.guild.name}`)
      .addFields(
        { name: 'Author', value: role.guild.me.user.tag, inline: false },
        { name: 'Role', value: `${role.name} (${role.id})`, inline: false },
      )
      .setTimestamp();
  
    resolveEvent(role.guild, embed);
  });

  client.on("guildMemberRemove", (member) => {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("User Kicked")
      .setDescription(`A member was kicked from ${member.guild.name}`)
      .addFields(
        { name: 'Author', value: member.guild.me.user.tag, inline: false },
        { name: 'Member', value: `${member.user.tag} (${member.user.id})`, inline: false },
      )
      .setTimestamp();
  
    resolveEvent(member.guild, embed);
  });

  client.on("guildBanAdd", (guild, user) => {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("User Banned")
      .setDescription(`A member was banned from ${guild.name}`)
      .addFields(
        { name: 'Author', value: guild.me.user.tag, inline: false },
        { name: 'Member', value: `${user.tag} (${user.id})`, inline: false },
      )
      .setTimestamp();
  
    resolveEvent(guild, embed);
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    // Verificar se newMember é uma instância válida e se newMember.user é uma instância válida
    if (!newMember || !newMember.user) return;

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

    const roleUpdates = [];

    // Verificar se houve alterações nas roles
    if (addedRoles.size > 0 || removedRoles.size > 0) {
      let executorTag = "Unknown";

      // Verificar se há logs de auditoria disponíveis
      try {
        const auditLogs = await newMember.guild.fetchAuditLogs({ type: 30, limit: 1 }); // Usando o valor do enum para MEMBER_ROLE_UPDATE
        const logEntry = auditLogs.entries.first();

        if (logEntry) {
          const executor = logEntry.executor;
          if (executor) {
            executorTag = executor.tag;
          }
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }

      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("User Role Update")
        .setDescription(`Roles were updated for ${newMember.user.tag} in ${newMember.guild.name}`)
        .addFields(
          { name: 'Author', value: executorTag, inline: false },
          { name: 'Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: false },
        )
        .setTimestamp();

      if (addedRoles.size > 0) {
        const addedRolesDescription = addedRoles.map(role => `Added role: ${role}`).join('\n');
        embed.addFields({ name: "Roles Added", value: addedRolesDescription, inline: false });
      }

      if (removedRoles.size > 0) {
        const removedRolesDescription = removedRoles.map(role => `Removed role: ${role}`).join('\n');
        embed.addFields({ name: "Roles Removed", value: removedRolesDescription, inline: false });
      }

      roleUpdates.push(embed);
    }

    // Enviar todas as atualizações de roles em um único evento
    for (const embed of roleUpdates) {
      await resolveEvent(newMember.guild, embed);
    }
  });

  client.on("userModerated", (newMember) => {
    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("User Moderated")
      .setDescription(`A member was moderated in ${newMember.guild.name}`)
      .addFields(
        { name: 'Author', value: newMember.guild.me.user.tag, inline: false },
        { name: 'Member', value: `${newMember.user.tag} (${newMember.user.id})`, inline: false },
      )
      .setTimestamp();
  
    resolveEvent(newMember.guild, embed);
  });
});