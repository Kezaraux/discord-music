const { createAudioResource, getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const musicState = require("../constants/musicState");
const { ephemeralReply, updateMusicMessage } = require("./messageHelper");

const youtubeUrlRegex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

const checkMemberInVoice = async (interaction) => {
    const { member, client } = interaction;
    if (member.voice.channel.id !== client.musicObj.voiceChannelId) {
        await ephemeralReply(
            interaction,
            "You must be in the voice channel the music player is bound to."
        );
        return false;
    }

    return true;
};

const checkVoiceAndReconnect = (interaction) => {
    const { client, guild } = interaction;
    if (!getVoiceConnection(client.musicObj.guildId)) {
        // const guild = await interaction.client.guilds.cache.get(client.musicObj.guildId);

        const connection = joinVoiceChannel({
            channelId: client.musicObj.voiceChannelId,
            guildId: client.musicObj.guildId,
            adapterCreator: guild.voiceAdapterCreator
        });
        connection.subscribe(client.player);
        client.musicObj.status = musicState.PLAYING;
    }
};

const validYoutubeUrl = (song) => youtubeUrlRegex.test(song);

module.exports = {
    checkMemberInVoice,
    checkVoiceAndReconnect,
    validYoutubeUrl
};
