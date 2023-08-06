const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "userinfo",
    description: "Get information about a user",
    usage: "<user>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: []
    },
    aliases: "",
    category: "info",
    SlashCommand: {
        options: [
            {
                name: "user",
                description: "The user to get information about",
                type: ApplicationCommandOptionType.User,
                required: false,
            },
        ],
        /**
         * Run the slash command
         * @param {import("./library/MusicBot")} client - The client instance
         * @param {import("discord.js").Interaction} interaction - The interaction object
         */
        run: async (client, interaction) => {
            const targetUser = interaction.options.getUser("user") || interaction.user;
            const member = interaction.guild.members.cache.get(targetUser.id);

            const embed = new EmbedBuilder()
                .setTitle("User Information")
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
                .addFields(
                    { name: "Username", value: `${targetUser.username}`, inline: true },
                    { name: "Discriminator", value: `${targetUser.discriminator}`, inline: true },
                    { name: "User ID", value: `${targetUser.id}`, inline: true },
                    { name: "Joined Server", value: member ? `${member.joinedAt.toUTCString()}` : "N/A", inline: true },
                    { name: "Account Created", value: `${targetUser.createdAt.toUTCString()}`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        },
    },
};