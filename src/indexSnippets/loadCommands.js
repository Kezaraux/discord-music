const fs = require("fs");

// Register commands
const cmds = [];
const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    logger.info(`Registering command: ${command.data.name}`);
    client.commands.set(command.data.name, command);
    cmds.push(command.data);
}
