const { Client, Routes, REST } = require("discord.js");

/**
 * Deregister global slash commands for a guild
 * @param {require("./library/MusicBot")} client - The client instance
 */

module.exports = async (client) => {
    const rest = new REST({ version: '10' }).setToken(client.config.Token);

    try {
        // Fetch all slash commands registered for the bot's application
        const data = await rest.get(Routes.applicationCommands(client.config.Id));
        const promises = [];

        for (const command of data) {
            // Construct the delete URL for each command
            const deleteUrl = `${Routes.applicationCommands(client.config.Id)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }

        // Wait for all the delete operations to complete
        await Promise.all(promises);

        // Output a warning message after deregistration
        client.warn("Global slash commands deregistered.");
    } catch (error) {
        // Handle errors and log them
        client.error(error);
    }
};