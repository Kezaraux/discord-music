const buttonCustomIds = require("../constants/buttonCustomIds");
const { ephemeralReply } = require("../helpers/messageHelper");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.SKIP,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling skip button");

        if (!(await checkMemberInVoice(interaction))) return;

        client.player.stop();

        await ephemeralReply(interaction, "Skipped song.");
    },
};
