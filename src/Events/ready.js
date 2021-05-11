class Ready {
  constructor(client) {
    this.enable = true;
    this.client = client;
  }

  run() {
    const client = this.client;

    let Messages = client.config.Messages;

    Messages.forEach(async (message) => {
      let guild = client.guilds.cache.get(message.guild);
      let channel = guild.channels.cache.get(message.channel);
      let msg = await channel.messages.fetch(message.id);

      await msg.react(message.reaction);
    });
  }
}

module.exports = Ready;
