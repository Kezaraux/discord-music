const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { video_basic_info } = require("play-dl");

const buttonCustomIds = require("../constants/buttonCustomIds");
const musicState = require("../constants/musicState");

const constructMusicMessage = async (musicPlayerObj, active = true) => {
    const { status, queue, currentSong, voiceChannelName } = musicPlayerObj;
    const playing = status === musicState.PLAYING;

    const controlRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(playing ? buttonCustomIds.PAUSE : buttonCustomIds.UNPAUSE)
            .setLabel(playing ? "Pause" : "Unpause")
            .setStyle(playing ? ButtonStyle.Secondary : ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(buttonCustomIds.SKIP)
            .setLabel("Skip")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(buttonCustomIds.STOP)
            .setLabel("Stop")
            .setStyle(ButtonStyle.Danger),
    );
    const infoRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(buttonCustomIds.ADD_SONG)
            .setLabel("Add song")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(buttonCustomIds.SHOW_QUEUE)
            .setLabel("Show queue")
            .setStyle(ButtonStyle.Secondary),
    );

    const info = currentSong ? await video_basic_info(currentSong) : "Nothing";

    const embed = new EmbedBuilder()
        .setTitle(active ? `Music player for ${voiceChannelName}` : "Inactive music player")
        .addFields(
            { name: "Status", value: `${active ? status : "INACTIVE"}` },
            {
                name: "Now playing",
                value: `${active ? info?.video_details?.title ?? info : "Nothing"}`,
            },
            { name: "Songs in queue", value: `${active ? queue.length : "0"}` },
        );

    return active
        ? {
              embeds: [embed],
              components: [controlRow, infoRow],
          }
        : { content: "\u200b", embeds: [embed], components: [] };
};

module.exports = {
    constructMusicMessage,
};
