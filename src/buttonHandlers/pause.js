const buttonCustomIds = require("../constants/buttonCustomIds");
const musicState = require("../constants/musicState");
const { ephemeralReply, updateMusicMessage } = require("../helpers/messageHelper");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.PAUSE,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling pause button");

        if (!(await checkMemberInVoice(interaction))) return;

        client.player.pause();
        client.musicObj.status = musicState.PAUSED;
        updateMusicMessage(client);

        await ephemeralReply(interaction, "Paused");
    }
};
