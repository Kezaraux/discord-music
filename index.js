const fs = require("fs");
const winston = require("winston");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require("@discordjs/voice");

const { Client, Collection, Intents } = require("discord.js");
const { token, guildId, clientId } = require("./config.json");
const { updateMusicMessage, deleteMusicMessage } = require("./src/helpers/messageHelper");
const musicState = require("./src/constants/musicState");

const player = createAudioPlayer();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
client.commands = new Collection();
client.buttonHandlers = new Collection();
client.modalHandlers = new Collection();

client.player = player;
client.musicObj = {
    currentSong: "",
    messageId: "",
    channelId: "",
    voiceChannelId: "",
    voiceChannelName: "",
    guildId: "",
    status: musicState.DISCONNECTED,
    queue: []
};

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.printf((log) => `[${log.level.toUpperCase()}] - ${log.message}`)
});

// Register commands
const cmds = [];
const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    logger.info(`Registering command: ${command.data.name}`);
    client.commands.set(command.data.name, command);
    cmds.push(command.data);
}

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

// Handle music player events
player.on("idle", async (oldState, newState) => {
    client.musicObj.currentSong = client.musicObj.queue.shift();
    if (!client.musicObj.currentSong) {
        client.musicObj.status = musicState.DISCONNECTED;
        await updateMusicMessage(client);
        const connection = getVoiceConnection(client.musicObj.guildId);
        if (connection) connection.destroy();
        return;
    }
    const source = await play.stream(client.musicObj.currentSong);
    const resource = createAudioResource(source.stream, { inputType: source.type });
    player.play(resource);
    updateMusicMessage(client);
});

player.on("autopaused", async (oldState, newState) => {
    logger.info("Autopaused - Bot was probably manually disconnected");
    client.musicObj.status = musicState.DISCONNECTED_AND_PAUSED;
    await updateMusicMessage(client);
    const connection = getVoiceConnection(client.musicObj.guildId);
    if (connection) connection.destroy();
});

player.on("error", (err) => {
    logger.info("Player encountered error");
    console.error(err);
});

// Register button handlers
const buttonHandlerFiles = fs
    .readdirSync("./src/buttonHandlers")
    .filter((file) => file.endsWith(".js"));
for (const file of buttonHandlerFiles) {
    const handler = require(`./src/buttonHandlers/${file}`);
    logger.info(`Registering button handler: ${handler.name}`);
    client.buttonHandlers.set(handler.name, handler);
}

// Register modal handlers
const modalHandlerFiles = fs
    .readdirSync("./src/modalHandlers")
    .filter((file) => file.endsWith(".js"));
for (const file of modalHandlerFiles) {
    const handler = require(`./src/modalHandlers/${file}`);
    logger.info(`Registering modal handler: ${handler.name}`);
    client.modalHandlers.set(handler.name, handler);
}

client.once("ready", async () => {
    logger.info("Registering commands with the API");

    const rest = new REST({ version: "9" }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: cmds.map((cmd) => cmd.toJSON())
    })
        .then(() => {
            logger.info("Successfully registered application commands");
        })
        .catch(console.error);

    logger.info("The bot is ready to handle commands!");
});

client.login(token);

// Exit handling logic
const exitHandler = () => {
    logger.info("Attempting to deactivate music message");
    deleteMusicMessage(client);
    logger.info("Attempting to destroy connection");
    const connection = getVoiceConnection(client.musicObj.guildId);
    if (connection) connection.destroy();
    logger.info("Finished all exit actions");
};

process.on("SIGINT", () => {
    logger.info("Handling SIGINT");
    exitHandler();
    process.exit(0);
});
process.on("SIGTERM", () => {
    logger.info("Handling SIGTERM");
    exitHandler();
    process.exit(0);
});
process.on("SIGUSR1", () => {
    logger.info("Handling SIGUSR1");
    exitHandler();
    process.exit(0);
});
process.on("SIGUSR2", () => {
    logger.info("Handling SIGUSR2");
    exitHandler();
    process.exit(0);
});
process.on("uncaughtException", (err) => {
    logger.info("Handling uncaught exception");
    console.error(err, "Uncaught exception thrown");
    exitHandler();
    process.exit(1);
});
