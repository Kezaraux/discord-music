module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async ({ 0: interaction, client, logger }) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;
        logger.info(`Handling command: ${commandName}`);
        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);
        try {
            await command.execute(interaction, logger);
        } catch (error) {
            console.error(error);
        }
    }
};
