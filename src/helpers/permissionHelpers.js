const { Permissions } = require("discord.js");

const { ephemeralReply } = require("./messageHelper");

const checkSendMessagePermission = async (interaction) => {
    const { guild, channel } = interaction;
    if (!channel.permissionsFor(guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
        await ephemeralReply(
            interaction,
            "I cannot send messages in this channel! Check my or the channel's permissions."
        );
        return false;
    }

    return true;
};

const checkVoicePermissions = async (interaction, channel) => {
    const { guild } = interaction;
    if (
        !channel.permissionsFor(guild.me).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])
    ) {
        await ephemeralReply(
            interaction,
            "I cannot connect or speak in that voice channel! Check my or the channel's permissions."
        );
        return false;
    }

    return true;
};

module.exports = {
    checkSendMessagePermission,
    checkVoicePermissions
};
