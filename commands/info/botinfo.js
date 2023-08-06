const { EmbedBuilder, ApplicationCommandOptionType, version: discordJSVersion } = require("discord.js");

module.exports = {
    name: "botinfo",
    description: "Get information about the bot",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: []
    },
    aliases: "",
    category: "info",
    SlashCommand: {
        options: [],
        /**
         * Run the slash command
         * @param {import("./library/MusicBot")} client - The client instance
         * @param {import("discord.js").Interaction} interaction - The interaction object
         */
        run: async (client, interaction) => {
            const botUser = client.user;

            const embed = new EmbedBuilder()
                .setTitle("Bot Information")
                .setDescription("Information about the bot")
                .setThumbnail(botUser.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                .addFields(
                    { name: "Username", value: `${botUser.username}`, inline: true },
                    { name: "Discriminator", value: `${botUser.discriminator}`, inline: true },
                    { name: "Bot ID", value: `${botUser.id}`, inline: true },
                    { name: "Created At", value: `${botUser.createdAt.toUTCString()}`, inline: false },
                    { name: "Library", value: "discord.js", inline: true },
                    { name: "Library Version", value: `v${discordJSVersion}`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        },
    },
};