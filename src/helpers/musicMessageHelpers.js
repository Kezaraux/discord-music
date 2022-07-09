const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { video_basic_info } = require("play-dl");

const buttonCustomIds = require("../constants/buttonCustomIds");
const musicState = require("../constants/musicState");

const constructMusicMessage = async (musicPlayerObj, active = true) => {
    const { status, queue, currentSong, voiceChannelName } = musicPlayerObj;
    const playing = status === musicState.PLAYING;

    const controlRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(playing ? buttonCustomIds.PAUSE : buttonCustomIds.UNPAUSE)
            .setLabel(playing ? "Pause" : "Unpause")
            .setStyle(playing ? "SECONDARY" : "SUCCESS"),
        new MessageButton().setCustomId(buttonCustomIds.SKIP).setLabel("Skip").setStyle("PRIMARY"),
        new MessageButton().setCustomId(buttonCustomIds.STOP).setLabel("Stop").setStyle("DANGER")
    );
    const infoRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(buttonCustomIds.ADD_SONG)
            .setLabel("Add song")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId(buttonCustomIds.SHOW_QUEUE)
            .setLabel("Show queue")
            .setStyle("SECONDARY")
    );

    const info = currentSong ? await video_basic_info(currentSong) : "Nothing";

    const embed = new MessageEmbed()
        .setTitle(active ? `Music player for ${voiceChannelName}` : "Inactive music player")
        .addField("Status", `${active ? status : "INACTIVE"}`)
        .addField("Now playing", `${active ? info?.video_details?.title ?? info : "Nothing"}`)
        .addField("Songs in queue", `${active ? queue.length : "0"}`);

    return active
        ? {
              embeds: [embed],
              components: [controlRow, infoRow]
          }
        : { content: "\u200b", embeds: [embed], components: [] };
};

module.exports = {
    constructMusicMessage
};
