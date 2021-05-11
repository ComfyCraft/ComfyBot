require('discord.js');

class MessageReactionRemove {
  constructor(client) {
    this.enable = true;
    this.client = client;
  }

  run(reaction, user) {
    if (!reaction.message) fetch(reaction.message.id);
    let message = this.client.config.Messages.find(
      (m) =>
        m.id === reaction.message.id &&
        reaction.emoji.name === m.reaction &&
        reaction.message.guild.id === m.guild &&
        !user.bot
    );

    if (!message) return;

    let member = reaction.message.guild.member(user);
    let role = reaction.message.guild.roles.cache.get(message.roleId);

    if (!member.roles.cache.has(role.id)) return;

    member.roles.remove(role.id);

    try {
      user.send(
        `The \`${role.name}\` role was removed from you in \`${reaction.message.guild.name}\` \:)`
      );
    } catch (e) {}
  }
}

module.exports = MessageReactionRemove;
