const { getVoiceConnection } = require("@discordjs/voice");

const buttonCustomIds = require("../constants/buttonCustomIds");
const { ephemeralReply, deleteMusicMessage } = require("../helpers/messageHelper");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.STOP,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling stop button");

        if (!(await checkMemberInVoice(interaction))) return;

        client.player.stop();
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection) connection.destroy();
        await deleteMusicMessage(client);

        await ephemeralReply(
            interaction,
            "I stopped this instance of the music player and updated the message!"
        );
    }
};
