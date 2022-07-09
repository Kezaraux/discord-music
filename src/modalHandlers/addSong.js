const { createAudioResource, getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const play = require("play-dl");

const buttonCustomIds = require("../constants/buttonCustomIds");
const { ephemeralReply, updateMusicMessage } = require("../helpers/messageHelper");
const { checkVoiceAndReconnect, validYoutubeUrl } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.ADD_SONG,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling add song modal submit");

        const song = interaction.fields.getTextInputValue("song");
        if (!validYoutubeUrl(song)) {
            await ephemeralReply(interaction, "Please provide a valid Youtube URL.");
            return;
        }

        checkVoiceAndReconnect(interaction);

        if (!client.musicObj.currentSong) {
            client.musicObj.currentSong = song;

            const source = await play.stream(client.musicObj.currentSong);
            const resource = createAudioResource(source.stream, { inputType: source.type });
            client.player.play(resource);
        } else {
            client.musicObj.queue.push(song);
        }
        await updateMusicMessage(client);

        await ephemeralReply(interaction, "Added song");
    }
};
