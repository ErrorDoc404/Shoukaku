const { EmbedBuilder, ActionRowBuilder, ButtonStyles, ButtonComponents } = require("discord.js");

module.exports = {
    name: "help",
    description: "Show a list of available commands",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: []
    },
    aliases: ["commands"],
    category: "info",
    SlashCommand: {
        options: [],
        /**
         * Run the slash command
         * @param {import("./library/MusicBot")} client - The client instance
         * @param {import("discord.js").Interaction} interaction - The interaction object
         */
        run: async (client, interaction) => {
            const prefix = "!"; // Customize this prefix according to your bot's prefix
            const commands = client.SlashCommands;
            const pageSize = 1; // Number of commands to display per page

            const pages = [];
            let page = 0;

            // Split commands into pages
            while (page * pageSize < commands.length) {
                const start = page * pageSize;
                const end = (page + 1) * pageSize;
                const pageCommands = commands.slice(start, end);
                pages.push(pageCommands);
                page++;
            }

            const embed = new EmbedBuilder()
                .setTitle("Bot Commands")
                .setDescription("Here is a list of available commands:");

            // Function to format the command fields
            const formatCommandFields = (commandsList) => {
                commandsList.forEach((command) => {
                    embed.addField(
                        command.name,
                        `\`${prefix}${command.name}\` - ${command.description}`
                    );
                });
            };

            // Set the initial page
            formatCommandFields(pages[0]);

            // Send the initial page as a reply
            const helpMessage = await interaction.reply({ embeds: [embed] });

            // Add pagination buttons
            if (pages.length > 1) {
                const previousButton = new ButtonComponents()
                    .setCustomId("previous")
                    .setLabel("Previous")
                    .setStyle(ButtonStyles.SECONDARY);

                const nextButton = new ButtonComponents()
                    .setCustomId("next")
                    .setLabel("Next")
                    .setStyle(ButtonStyles.SECONDARY);

                const paginationRow = new ActionRowBuilder().addComponents(previousButton, nextButton);

                // Add the pagination row to the message
                helpMessage.edit({ components: [paginationRow] });

                const filter = (interaction) => interaction.user.id === interaction.user.id;
                const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

                let currentPage = 0;

                collector.on("collect", async (interaction) => {
                    if (interaction.customId === "previous" && currentPage > 0) {
                        currentPage--;
                    } else if (interaction.customId === "next" && currentPage < pages.length - 1) {
                        currentPage++;
                    }

                    // Update the embed with the new page
                    embed.fields = [];
                    formatCommandFields(pages[currentPage]);
                    await interaction.update({ embeds: [embed] });
                });

                collector.on("end", () => {
                    // Remove the pagination row from the message
                    paginationRow.components.forEach((component) => component.setDisabled(true));
                    helpMessage.edit({ components: [paginationRow] });
                });
            }
        },
    },
};