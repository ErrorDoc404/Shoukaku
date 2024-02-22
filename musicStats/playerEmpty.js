const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports.run = async (client, player  ) => {
    const musicMsg = client.musicMessage[player.guildId];
    client.skipSong[player.guildId] = false;
    client.skipBy[player.guildId] = false;
    client.guildQueue[player.guildId] = 0;

    const embed = {
        title: `🎵 Vibing Music 🎵`,
        description: `Few permissions have been changed for the bot. Please re-invite the awesome bot using the new link. Thank you! \n\n [Invite Link](https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
        color: 0xd43790,
        image: {
            url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
        },
        thumbnail: {
            url: '',
        },
        footer: {
            text: `${client.user.username} Music`,
            iconURL: `${client.user.avatarURL()}`,
        },
    };

    const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId('pause')
            .setLabel(`⏸️ Pause`)
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('skip')
            .setLabel(`⏭️ Skip`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('clear')
            .setLabel(`🗑️ Clear`)
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId('stop')
            .setLabel(`⏹️ Stop`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('fix')
            .setLabel(`⚒️ Repair`)
            .setStyle(ButtonStyle.Secondary),
    ]);

    musicMsg.edit({ content: `**[ Nothing Playing ]**`, embeds: [embed], components: [row] });

    player.destroy();
};