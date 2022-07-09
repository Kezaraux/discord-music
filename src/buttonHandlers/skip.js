const { getVoiceConnection, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

const buttonCustomIds = require("../constants/buttonCustomIds");
const musicState = require("../constants/musicState");
const { ephemeralReply, updateMusicMessage } = require("../helpers/messageHelper");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.SKIP,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling skip button");

        if (!(await checkMemberInVoice(interaction))) return;

        client.player.stop();
        client.musicObj.currentSong = client.musicObj.queue.shift();
        if (!client.musicObj.currentSong) {
            logger.info("Skipped song, no next song, disconnecting");
            client.musicObj.status = musicState.DISCONNECTED;
            await updateMusicMessage(client);
            const connection = getVoiceConnection(client.musicObj.guildId);
            if (connection) connection.destroy();
            await ephemeralReply(
                interaction,
                "Skipped song - no other songs in queue, disconnecting."
            );
            return;
        }
        const source = await play.stream(client.musicObj.currentSong);
        const resource = createAudioResource(source.stream, { inputType: source.type });
        client.player.play(resource);
        await updateMusicMessage(client);

        await ephemeralReply(interaction, "Skipped song.");
    }
};
