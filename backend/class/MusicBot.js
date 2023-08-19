const { Client, Partials, GatewayIntentBits, Collection } = require('discord.js');
const Logger = require('./Logger');
const logger = new Logger();
const Express = require("express");
const http = require("http");
const ConfigFetcher = require('../../config');

class ShoukakuMusicBot extends Client {

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

        //creating Web portal
        this.server = Express();
        this.http = http.createServer(this.server);

        // client
        var client = this;
    }

    log(Text) {
        logger.log(Text);
    }

    warn(Text) {
        logger.warn(Text);
    }

    error(Text) {
        logger.error(Text);
    }

    build() {
        this.login(this.config.Token);
    }
}

module.exports = ShoukakuMusicBot;