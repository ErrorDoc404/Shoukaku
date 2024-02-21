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

        let node = client.kazagumo.shoukaku.nodes;

        let state = null;

        node.forEach(element => {
            state = element.state;
        });

        if(state === 0) return message.channel.send(`❌ | **Shoukaku is not connected to any nodes!**`);

        // Fetch the music message from the database
        client.musicMessage[message.guild.id] = await message.channel.messages.fetch(MusicDB.musicMessageId);

        const {channel} = message.member.voice;
        
        if (!channel) return message.reply("You need to be in a voice channel to use this command!");

        let player = await client.kazagumo.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100
        });

        let result = await client.kazagumo.search(searchString, {requester: message.author});
        if (!result.tracks.length) return message.channel.send(`❌ | No results found!`);

        if (result.type === "PLAYLIST") for (let track of result.tracks) player.queue.add(track);
        else player.queue.add(result.tracks[0]);

        if (!player.playing && !player.paused) player.play();
        return message.channel.send({content: result.type === "PLAYLIST" ? `Queued ${result.tracks.length} from ${result.playlistName}` : `Queued ${result.tracks[0].title}`});
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}