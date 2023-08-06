const { Client, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

/**
 * Register slash commands for a guild
 * @param {require("./library/MusicBot")} client - The client instance
 */

module.exports = (client) => {
    const commands = [];
    const categories = fs.readdirSync(__dirname + '/../commands/');

    // Filter out files that don't end with '.js' from the categories
    categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
        // Read files from the current category directory that end with '.js'
        const files = fs.readdirSync(__dirname + `/../commands/${cat}/`).filter((f) =>
            f.endsWith('.js')
        );

        // Loop through the files asynchronously
        files.forEach(async (file) => {
            let cmd = require(__dirname + `/../commands/${cat}/` + file);

            // Skip the command if it doesn't have a SlashCommand or run function
            if (!cmd.SlashCommand || !cmd.SlashCommand.run) {
                client.warn(`Problem for loading ${cmd.name} Slash Command because it didn't find the run body`);
                return;
            }

            // Store the command in the client's SlashCommands collection
            client.SlashCommands.set(cmd.name, cmd);

            client.warn(`Loading ${cmd.name} Slash Command`);

            let dataStuff = {
                name: cmd.name,
                description: cmd.description,
                options: cmd.SlashCommand.options,
            };

            commands.push(dataStuff);
        });
    });

    const rest = new REST({ version: '10' }).setToken(client.config.Token);

    (async () => {
        try {
            client.log('Started refreshing application Slash commands.');

            // Send the put request to update the application's Slash commands
            await rest.put(
                Routes.applicationCommands(client.config.Id),
                {
                    body: commands,
                    application_id: client.config.Id
                },
            );

            client.log('Successfully reloaded application Slash commands.');
        } catch (error) {
            client.error(error);
        }
    })();
};