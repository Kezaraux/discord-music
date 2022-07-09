const fs = require("fs");

// Register event listeners
const eventFiles = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    logger.info(`Registering event: ${event.name}`);
    if (event.once) {
        client.once(
            event.name,
            async (...args) => await event.execute({ ...args, client, logger })
        );
    } else {
        client.on(event.name, async (...args) => await event.execute({ ...args, client, logger }));
    }
}
