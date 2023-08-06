const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: "play",
    description: "play music",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "inbuild",
    run: async (client, message, { MusicDB }) => {
        // Check if the user is in a voice channel
        if (!message.member.voice.channel) return message.channel.send(`❌ | **You must be in a voice channel to play something!**`);

        let searchString = message.content;
        let checkNode = client.shoukaku.getNode();

        // Check if the Shoukaku node is connected
        if (!checkNode || !checkNode.connected) return message.channel.send(`❌ | **Shoukaku node not connected**`);

        // Fetch the music message from the database
        client.musicMessage[message.guild.id] = await message.channel.messages.fetch(MusicDB.musicMessageId);

        const GuildData = await GuildConfig.findOne({ guildId: message.guild.id });
        client.twentyFourSeven[message.guild.id] = GuildData.twentyFourSeven;

        let player = client.shoukaku.getPlayer(message.guild.id);

        if (player && (!player.playing && player.voiceChannel !== message.member.voice.channel.id)) {
            // If bot is not playing and voice channel is different, destroy the player and create a new one
            await player.disconnect();
            player = undefined;
            await delay(1000);
        }

        if (!player || (!player.playing && player.voiceChannel === message.member.voice.channel.id)) {
            // If player is undefined or not playing and voice channel is the same, create a new player
            player = await client.shoukaku.joinVoiceChannel({
                guildID: message.guild.id,
                voiceChannelID: message.member.voice.channel.id,
                textChannelID: message.channel.id,
                selfDeaf: true,
            });
        }

        if (!player) return message.channel.send(`❌ | **Nothing is playing right now...**`);
        if (player.playing && player.voiceChannel !== message.member.voice.channel.id) return message.channel.send(`❌ | **You must be in the same voice channel as me to play something!**`);

        try {
            if (!player.connected) await player.connect();

            let searched = await player.search(searchString, message.author);

            if (searched.loadType === "NO_MATCHES") return message.channel.send(`**No matches found for -** ${searchString}`);
            else if (searched.loadType === "PLAYLIST_LOADED") {
                player.queue.add(searched.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === searched.tracks.length) player.play();
            } else {
                player.queue.add(searched.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) player.play();
            }

            if (player.queue.size >= 1) client.guildQueue[message.guild.id] = player.queue.size;

            if (player.queue.size === 1) {
                content = `**[ Now Playing ]**\n${player.queue.current.title}.\n**[ ${player.queue.size} Songs in Queue ]**`;
                client.musicMessage[message.guild.id].edit({ content: content });
            } else if (player.queue.size > 1) {
                content = client.musicMessage[message.guild.id].content.replace(`${player.queue.size - 1} Songs in Queue`, `${player.queue.size} Songs in Queue`);
                client.musicMessage[message.guild.id].edit({ content: content });
            }
        } catch (e) {
            message.channel.send(`**No matches found for -** ${searchString} with ${e}`);
        }
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}