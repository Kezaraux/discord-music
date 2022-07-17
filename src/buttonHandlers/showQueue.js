const { video_basic_info } = require("play-dl");

const buttonCustomIds = require("../constants/buttonCustomIds");
const { ephemeralReply } = require("../helpers/messageHelper");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.SHOW_QUEUE,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling show queue button");

        if (!(await checkMemberInVoice(interaction))) return;

        const firstFive = client.musicObj.queue.slice(0, 5);
        if (firstFive.length == 0) {
            await ephemeralReply(
                interaction,
                "The queue is empty! Consider adding some songs to it.",
            );
            return;
        }

        const songNames = await firstFive.reduce(async (acc, song) => {
            const info = await video_basic_info(song);
            return [...(await acc), info?.video_details?.title];
        }, []);
        const len = client.musicObj.queue.length;
        const isAre = len === 1 ? "is" : "are";
        const songSongs = len === 1 ? "song" : "songs";
        const queueMessage = `There ${isAre} currently ${len} ${songSongs} in the queue. The next ${
            firstFive.length
        } ${songSongs} ${isAre}: \n${songNames.join("\n")}`;

        await ephemeralReply(interaction, queueMessage);
    },
};
