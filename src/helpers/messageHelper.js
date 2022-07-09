const { constructMusicMessage } = require("./musicMessageHelpers");

const ephemeralReply = async (interaction, msg) =>
    await interaction.reply({
        content: msg,
        ephemeral: true
    });

const updateMusicMessage = async (client) => {
    const constructedMessage = await constructMusicMessage(client.musicObj);
    const guild = await client.guilds.cache.get(client.musicObj.guildId);
    const channel = await guild.channels.cache.get(client.musicObj.channelId);
    const message = await channel.messages.fetch(client.musicObj.messageId, {
        cache: true,
        force: true
    });

    await message.edit(constructedMessage);
};

const deleteMusicMessage = async (client) => {
    const constructedMessage = await constructMusicMessage(client.musicObj, false);
    const guild = await client.guilds.cache.get(client.musicObj.guildId);
    const channel = await guild.channels.cache.get(client.musicObj.channelId);
    const message = await channel.messages.fetch(client.musicObj.messageId, {
        cache: true,
        force: true
    });

    await message.edit(constructedMessage);
};

module.exports = {
    ephemeralReply,
    updateMusicMessage,
    deleteMusicMessage
};
