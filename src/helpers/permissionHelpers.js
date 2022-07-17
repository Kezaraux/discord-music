const { PermissionFlagsBits } = require("discord.js");

const { ephemeralReply } = require("./messageHelper");

const checkSendMessagePermission = async interaction => {
    const { guild, channel } = interaction;
    if (!channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)) {
        await ephemeralReply(
            interaction,
            "I cannot send messages in this channel! Check my or the channel's permissions.",
        );
        return false;
    }

    return true;
};

const checkVoicePermissions = async (interaction, channel) => {
    const { guild } = interaction;
    if (
        !channel
            .permissionsFor(guild.members.me)
            .has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])
    ) {
        await ephemeralReply(
            interaction,
            "I cannot connect or speak in that voice channel! Check my or the channel's permissions.",
        );
        return false;
    }

    return true;
};

module.exports = {
    checkSendMessagePermission,
    checkVoicePermissions,
};
