const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Get information about the server",
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
            const server = interaction.guild;
            const owner = await server.members.fetch(server.ownerId);

            const embed = new EmbedBuilder()
                .setTitle("Server Information")
                .addFields(
                    { name: "Server Name", value: `${server.name}`, inline: true },
                    { name: "Member Count", value: `${server.memberCount}`, inline: true },
                    { name: "Creation Date", value: `${server.createdAt}`, inline: false },
                    { name: "Server Owner", value: `${owner.user.tag}`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        },
    },
};