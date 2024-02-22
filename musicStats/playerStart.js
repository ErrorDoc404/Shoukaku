const {EmbedBuilder} = require("discord.js");
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
const BotStats = require("../mongoose/database/schemas/Stats");

module.exports.run = async (client, player, track) => {
    client.MusicPlayed++;
    let content;
    const musicMsg = client.musicMessage[player.guildId];

    if (player.queue.length === 0) {
        content = ` **[ Now Playing ]** \n${track.title}.`;
    }
    else {
        content = `\n **[ Nothing Playing ]** \n${track.title}.\n**[ ${player.queue.length} Songs in Queue ]**`;
        musicMsg.edit({ content });
    }

    client.guildQueue[player.guild] = player.queue.length;
    const thumbnail = track.thumbnail ? track.thumbnail.replace('hqdefault', 'maxresdefault') : 'https://c.tenor.com/eDVrPUBkx7AAAAAd/anime-sleepy.gif';
    console.log(track.thumbnail);
    const msgEmbed = {
        title: track.title,
        color: 0xd43790,
        image: {
            url: thumbnail,
        },
        thumbnail: {
            url: track.thumbnail,
        },
        footer: {
            text: `🔊 Volume: ${player.volume}`,
            iconURL: `${client.user.avatarURL()}`,
        },
    };

    const playEmbed = new EmbedBuilder(msgEmbed);

    // Creating stats
    try {
        const statsQuery = { discordId: track.requester.id };
        const statsUpdate = {
            discordName: track.requester.username,
            $inc: { songsCounter: 1 },
        };
        const updateOptions = { new: true, upsert: true };

        const updatedStats = await BotStats.findOneAndUpdate(
            statsQuery,
            statsUpdate,
            updateOptions
        );
    } catch (error) {
        client.error(`Error updating/creating stats: ${error}`);
    }

    playEmbed.addFields({ name: `Requested By`, value: `${track.requester.username}`, inline: true });

    if (client.skipSong[player.guild] && client.skipBy[player.guild]) {
        playEmbed.addFields({ name: `${language.skipBy}`, value: `${client.skipBy[player.guild].username}`, inline: true });
        client.skipSong[player.guild] = false;
        client.skipBy[player.guild] = false;
    }

    musicMsg.edit({ content, embeds: [playEmbed] });

    client.playSong(track.title,player.queue.length);
};