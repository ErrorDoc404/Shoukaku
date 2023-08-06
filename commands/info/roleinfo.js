const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "roleinfo",
    description: "Get information about a role",
    usage: "<role>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: []
    },
    aliases: "",
    category: "info",
    SlashCommand: {
        options: [
            {
                name: "role",
                description: "The role to get information about",
                type: ApplicationCommandOptionType.Role,
                required: true
            }
        ],
        /**
         * Run the slash command
         * @param {import("./library/MusicBot")} client - The client instance
         * @param {import("discord.js").Interaction} interaction - The interaction object
         */
        run: async (client, interaction) => {
            const role = interaction.options.getRole("role");

            const embed = new EmbedBuilder()
                .setTitle("Role Information")
                .setDescription(`Information about the role "${role.name}"`)
                .setColor(role.color)
                .addFields(
                    { name: "Role Name", value: `${role.name}`, inline: true },
                    { name: "Role ID", value: `${role.id}`, inline: true },
                    { name: "Created At", value: `${role.createdAt.toUTCString()}`, inline: true },
                    { name: "Position", value: `${role.position}`, inline: true },
                    { name: "Mentionable", value: `${role.mentionable ? "Yes" : "No"}`, inline: true },
                    { name: "Hoisted", value: `${role.hoist ? "Yes" : "No"}`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        },
    },
};