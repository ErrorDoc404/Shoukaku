const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ConfigFetcher = require('../config');
const { Server } = require("socket.io");
const http = require("http");
const play = require('../music/play.js');
const fs = require('fs');
const Express = require("express");
const Logger = require("./Logger");
const logger = new Logger();
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

class MusicBot extends Client {

    constructor(
        props = {
            partials: [
                Partials.Channel, // for text channel
                Partials.GuildMember, // for guild member
                Partials.User, // for discord user
            ],
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        }

    ) {
        super(props);

        // Load Config File
        this.config = ConfigFetcher;

        this.musicMessage = [];

        this.skipSong = [];
        this.skipBy = [];
        this.twentyFourSeven = [];

        this.SlashCommands = new Collection();
        this.Commands = new Collection();
        this.MusicPlayed = 0;
        this.CommandsRan = 0;
        this.InQueue = 0;
        this.guildQueue = [];
        this.Buttons = new Collection();
        this.invites = new Collection();

        this.LoadEvents();
        this.LoadButtons();
        this.LoadCommands();

        this.Commands.set('play', play);

        var client = this;

        //creating Web portal
        this.server = Express();
        this.http = http.createServer(this.server);
        // this.server.use('/', require('../express'));
        // this.io = new Server(this.http);
        // require('../express/socket')(this.io);
    }

    async LoadEvents() {
        try {
            const files = await fs.promises.readdir('./events/');
            files.forEach(async (file) => {
                if (!file.endsWith('.js')) return;
                const evt = require(`../events/${file}`);
                let evtName = file.split('.')[0];
                this.on(evtName, evt.bind(null, this));
                logger.events(`Loaded event '${evtName}'`);
            });
        } catch (err) {
            console.error(err);
        }
    }

    async LoadButtons() {
        //load buttons here
    }

    async LoadCommands() {
        //load commands here
    }

    // Register slash commands for the bot
    async RegisterSlashCommands() {
        try {
            await require("./SlashCommand")(this);
        } catch (error) {
            console.error(error);
        }
    }

    // Deregister global slash commands
    async DeRegisterGlobalSlashCommands() {
        try {
            await require("./DeRegisterSlashGlobalCommands")(this);
        } catch (error) {
            console.error(error);
        }
    }

    // Deregister slash commands for each guild
    async DeRegisterGuildSlashCommands() {
        try {
            this.guilds.cache.forEach(async (guild) => {
                await require("./DeRegisterSlashGuildCommands")(this, guild.id);
            });
        } catch (error) {
            console.error(error);
        }
    }

    build() {
        this.warn('Getting Ready....');
        this.login(this.config.Token);
        if (this.config.ExpressServer) {
            this.warn('Server is starting');
            this.log('Server started...');
            this.http.listen(this.config.httpPort, () =>
                this.log(`Web HTTP Server has been started at ${this.config.httpPort}`)
            );
        }
    }

    //log
    log(text) {
        logger.log(text);
    }

    //warn
    warn(text) {
        logger.warn(text);
    }

    //error
    error(err) {
        logger.error(err);
    }

}

module.exports = MusicBot;