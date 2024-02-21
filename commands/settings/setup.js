const { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: "setup",
    description: "Setting to setup music channel",
    usage: "<channel>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["mods"],
    category: "settings",
    SlashCommand: {
        options: [
            {
                name: "channel",
                description: "Select channel to setup music",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
        ],
        /**
         * Run the slash command
         * @param {import("./library/MusicBot")} client - The client instance
         * @param {import("discord.js").Interaction} interaction - The interaction object
         */
        run: async (client, interaction, args, { MusicDB }) => {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                return interaction.reply("You don't have the Manage Server permission to run this command.").catch(err => {
                    client.error(err);
                });
            }

            const musicChannel = args.channel;
            if (!musicChannel) {
                return interaction.reply("Please provide a valid channel to set up music.").catch(err => {
                    client.error(err);
                });
            }

            const embed = {
                title: `🎵 Vibing Music 🎵`,
                description: `A few permissions have been changed for the bot. Please re-invite the bot using the new link below. Thank you!\n\n[Invite Link](https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
                color: 0xd43790,
                image: {
                    url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
                },
                thumbnail: {
                    url: '',
                },
                footer: {
                    text: `${client.user.username} Music`,
                    iconURL: client.user.avatarURL() ? client.user.avatarURL() : null,
                },
            };

            const row = new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setCustomId('pause')
                        .setLabel('⏸️ Pause')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('skip')
                        .setLabel('⏭️ Skip')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('clear')
                        .setLabel('🗑️ Clear')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('stop')
                        .setLabel('⏹️ Stop')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('fix')
                        .setLabel('⚒️ Repair')
                        .setStyle(ButtonStyle.Secondary),
            ]);

            musicChannel.send({ content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or URL here.`, embeds: [embed], components: [row] })
                .then(async (data) => {
                    const channelId = musicChannel.id;
                    const messageId = data.id;
                    await GuildConfig.findOneAndUpdate(
                        { guildId: MusicDB.guildId },
                        {
                            musicChannelId: channelId,
                            musicMessageId: messageId
                        },
                        { upsert: true }
                    );
                })
                .then(() => {
                    interaction.reply(`Setup complete`).catch(err => {
                        client.error(err);
                    });
                })
                .catch(err => {
                    client.error(err);
                });
        }
    },
};