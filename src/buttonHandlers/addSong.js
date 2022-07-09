const { Modal, MessageActionRow, TextInputComponent } = require("discord.js");

const buttonCustomIds = require("../constants/buttonCustomIds");
const { checkMemberInVoice } = require("../helpers/voiceHelpers");

module.exports = {
    name: buttonCustomIds.ADD_SONG,
    execute: async ({ interaction, client, logger }) => {
        logger.info("Handling add song button");

        if (!(await checkMemberInVoice(interaction))) return;

        const modal = new Modal()
            .setCustomId(buttonCustomIds.ADD_SONG)
            .setTitle("Add a song!")
            .addComponents(
                new MessageActionRow().addComponents(
                    new TextInputComponent()
                        .setCustomId("song")
                        .setLabel("Youtube URL")
                        .setStyle("SHORT")
                )
            );
        await interaction.showModal(modal);
    }
};
