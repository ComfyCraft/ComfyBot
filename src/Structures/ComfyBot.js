const { Client, Collection } = require('discord.js'),
  path = require('path'),
  glob = require('glob');
const fs = require('fs');
const Command = require('./Command.js');
require('dotenv/config');

class ComfyBot extends Client {
  constructor(options = { partials: ['REACTION', 'MESSAGE'] }) {
    super(options);

    this.config = require('../config.js');
    this.commands = new Collection();
    this.aliases = new Collection();

    console.log('Client Initialized <3');
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  async loadCommands() {
    glob(`${this.directory}/Commands/**/*.js`, (er, files) => {
      if (er) throw new Error(er);

      for (const file of files) {
        delete require.cache[[`${file}`]];
        const cmd = require(file);
        const command = new cmd(this);
        const filename = file.slice(file.lastIndexOf('/') + 1, file.length - 3);

        if (!(command instanceof Command))
          throw new TypeError(
            `${filename} is not a correct command. Not an instance of "Command" class.`
          );

        this.commands.set(command.name, command);

        command.aliases.length &&
          command.aliases.map((alias) => this.aliases.set(alias, command.name));

        console.log(
          `${filename} loaded (aliases below) ${command.aliases
            .map((alias) => `\n- ${alias}`)
            .join('')}`
        );
      }
    });
  }

  loadEvents() {
    glob(`${this.directory}/Events/**/*.js`, (er, files) => {
      if (er) throw new Error(er);

      for (const file of files) {
        delete require.cache[[`${file}`]];
        const event = new (require(file))(this),
          eventname = file.slice(file.lastIndexOf('/') + 1, file.length - 3);

        if (event.enable) super.on(eventname, (...args) => event.run(...args));
      }
    });
  }

  login() {
    const TOKEN = this.config.Token;

    if (!TOKEN || typeof TOKEN != 'string')
      throw new Error('None or invalid token provided.');

    super.login(TOKEN);
  }

  init() {
    this.loadEvents();
    this.loadCommands();
    this.login();
  }
}

module.exports = ComfyBot;
