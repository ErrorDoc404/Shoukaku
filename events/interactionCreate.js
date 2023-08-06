module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
        const [name, ...params] = interaction.customId.split("-");

        const button = client.Buttons.get(name);

        if (!button) return;
        button.run(client, interaction, params);
    }

    const command = interaction.commandName;

    let cmd = client.SlashCommands.get(command);
    if (!cmd) return;

    const args = interaction.options._hoistedOptions[0];

    if (cmd.SlashCommand && cmd.SlashCommand.run) {
        cmd.SlashCommand.run(client, interaction, args);
    }

    client.CommandsRan++;
};