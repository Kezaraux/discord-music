const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

const buttonCustomIds = require("../constants/buttonCustomIds");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.ADD_SONG,
    execute: async ({ interaction, logger }) => {
        logger.info("Handling add song button");

        if (!(await checkMemberInVoice(interaction))) return;

        const modal = new ModalBuilder()
            .setCustomId(buttonCustomIds.ADD_SONG)
            .setTitle("Add a song!")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("song")
                        .setLabel("Youtube URL")
                        .setStyle(TextInputStyle.Short),
                ),
            );
        await interaction.showModal(modal);
    },
};
