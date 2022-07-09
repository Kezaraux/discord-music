const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

const { constructMusicMessage } = require("../helpers/musicMessageHelpers.js");
const { ephemeralReply } = require("../helpers/messageHelper.js");
const {
    checkSendMessagePermission,
    checkVoicePermissions
} = require("../helpers/permissionHelpers");
const musicState = require("../constants/musicState");
const { validYoutubeUrl } = require("../helpers/voiceHelpers");

const songOption = "song";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play-music")
        .setDescription(
            "Joins the bot to your voice channel and creates a message to control music playback."
        )
        .addStringOption((option) =>
            option
                .setName(songOption)
                .setDescription("The Youtube URL of the initial song you wish to play.")
                .setRequired(true)
        ),
    execute: async (interaction, logger) => {
        const { member, options, client, guild, channel } = interaction;
        const voiceChannel = member?.voice?.channel;

        if (!(await checkSendMessagePermission(interaction))) return;

        if (!voiceChannel) {
            await ephemeralReply(interaction, "You're not in a voice channel.");
            return;
        }

        if (!(await checkVoicePermissions(interaction, voiceChannel))) return;

        const song = options.getString(songOption);
        if (!validYoutubeUrl(song)) {
            await ephemeralReply(interaction, "Please provide a valid Youtube URL.");
            return;
        }

        client.musicObj.currentSong = song;
        client.musicObj.status = musicState.PLAYING;

        const musicEmbedObject = await constructMusicMessage(client.musicObj);
        const newMessage = await channel.send({
            ...musicEmbedObject
        });

        client.musicObj.messageId = newMessage.id;
        client.musicObj.channelId = newMessage.channel.id;
        client.musicObj.guildId = newMessage.guild.id;
        client.musicObj.voiceChannelId = voiceChannel.id;
        client.musicObj.voiceChannelName = voiceChannel.name;

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        const source = await play.stream(client.musicObj.currentSong);
        const resource = createAudioResource(source.stream, { inputType: source.type });

        client.player.play(resource);
        connection.subscribe(client.player);

        await ephemeralReply(interaction, "Done");
    }
};
