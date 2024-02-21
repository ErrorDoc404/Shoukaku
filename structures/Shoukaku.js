const {Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const ConfigFetcher = require("../config");
const Logger = require("./Logger");
const logger = new Logger();
const fs = require('fs');
const {Shoukaku, Connectors} = require("shoukaku");
const {Kazagumo, KazagumoTrack} = require("kazagumo");
const Spotify = require('kazagumo-spotify');
const mongoose = require('mongoose');
const play = require("../music/play");
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

class ShoukakuClientBot extends Client {

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
            ]
        }
    ) {

        super(props);

        this.config = ConfigFetcher;

        this.musicMessage = [];

        this.skipSong = [];
        this.skipBy = [];
        this.twentyFourSeven = [];
        this.MusicPlayed = 0;
        this.CommandsRan = 0;
        this.InQueue = 0;
        this.guildQueue = [];
        this.currentSong = [];

        this.commands = new Collection();
        this.Buttons = new Collection();
        this.aliases = new Collection();
        this.SlashCommands = new Collection();

        var client = this;

        this.Nodes = [this.config.lavalink];

        const spotify = new Spotify({
            clientId: this.config.Spotify.ClientID,
            clientSecret: this.config.Spotify.ClientSecret,
            playlistPageLimit: 1, // optional ( 100 tracks per page )
            albumPageLimit: 1, // optional ( 50 tracks per page )
            searchLimit: 10, // optional ( track search limit. Max 50 )
            searchMarket: 'US', // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
        });

        client.kazagumo = new Kazagumo({
            defaultSearchEngine: "youtube",
            // MAKE SURE YOU HAVE THIS
            send: (guildId, payload) => {
                const guild = this.guilds.cache.get(guildId);
                if (guild) guild.shard.send(payload);
            },
            plugins: [spotify]
        }, new Connectors.DiscordJS(client), this.Nodes);

        this.logger = logger;

        this.config.handlers.forEach((handler) => {
            require(`../handlers/${handler}`)(client);
        });

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

    RegisterSlashCommands() {
        require("./SlashCommand")(this);
    }

    DeRegisterGlobalSlashCommands() {
        require("./DeRegisterSlashGlobalCommands")(this);
    }

    DeRegisterGuildSlashCommands() {
        this.guilds.cache.forEach((guild) => {
            require("./DeRegisterSlashGuildCommands")(this, guild.id);
        });
    }

    build(){
        this.warn('Getting Ready....');
        this.login(this.config.Token);
        if (this.config.ExpressServer) {
            this.warn('Server is starting');
            this.log('Server started...');
            this.http.listen(this.config.httpPort, () =>
                this.log(`Web HTTP Server has been started at ${this.config.httpPort}`)
            );
        }

        this.MongooseConnect();

        this.commands.set('play', play);
    }

    playSong(song, queueLength) {
        logger.playSong(song, queueLength);
    }

    MongooseConnect() {
        mongoose.set('strictQuery', true);
        mongoose.connect(this.config.mongooseURL)
            .then(data => {
                this.warn(`Connected to ${data.connection.host}:${data.connection.port} database: ${data.connection.name}`);
            })
            .catch(err => { this.warn(err) });
    }

    GetMusic(GuildID) {
        return new Promise(async (res, rej) => {
            const findGuildConfig = await GuildConfig.findOne({ guildId: GuildID });
            res(findGuildConfig);
        });
    }

}

module.exports = ShoukakuClientBot;