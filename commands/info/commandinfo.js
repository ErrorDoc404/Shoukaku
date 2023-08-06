const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "commandinfo",
    description: "Get information about a command",
    usage: "<command>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: []
    },
    aliases: [],
    category: "info",
    SlashCommand: {
        options: [
            {
                name: "command",
                description: "The command to get information about",
                type: 3,
                required: true
            }
        ],
        run: async (client, interaction) => {
            const commandName = interaction.options.getString("command");
            const command = client.commands.get(commandName);

            if (!command) {
                return interaction.reply("Command not found.");
            }

            const embed = new EmbedBuilder()
                .setTitle("Command Information")
                .addFields(
                    { name: "Name", value: command.name, inline: true },
                    { name: "Description", value: command.description || "No description provided", inline: true },
                    { name: "Usage", value: command.usage || "No usage information provided", inline: true },
                    { name: "Aliases", value: command.aliases.length > 0 ? command.aliases.join(", ") : "No aliases", inline: true },
                    { name: "Category", value: command.category || "No category provided", inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        }
    }
};