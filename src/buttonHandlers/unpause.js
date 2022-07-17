const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");

const buttonCustomIds = require("../constants/buttonCustomIds");
const musicState = require("../constants/musicState");
const { ephemeralReply, updateMusicMessage } = require("../helpers/messageHelper");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.UNPAUSE,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling play button");

        if (!(await checkMemberInVoice(interaction))) return;

        if (
            !getVoiceConnection(client.musicObj.guildId) &&
            (client.musicObj.currentSong || client.musicObj.queue.length != 0)
        ) {
            const guild = await interaction.client.guilds.cache.get(client.musicObj.guildId);

            const connection = joinVoiceChannel({
                channelId: client.musicObj.voiceChannelId,
                guildId: client.musicObj.guildId,
                adapterCreator: guild.voiceAdapterCreator,
            });
            connection.subscribe(client.player);
        }

        client.player.unpause();
        client.musicObj.status = musicState.PLAYING;
        updateMusicMessage(client);

        await ephemeralReply(interaction, "Playing");
    },
};
