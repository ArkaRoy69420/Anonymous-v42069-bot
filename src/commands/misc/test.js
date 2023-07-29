const { ApplicationCommandOptionType, Emoji } = require('discord.js');
const emojiHandler = require('../../../command utility/handleEmojis');

module.exports = {
    name: 'test',
    description: 'Upload an emoji to the bot. For only devs in test server.',
    deleted: false,
    devOnly: true,
    testOnly: true,

    callback: async (client, interaction) => {
        // all the content for testing purposes
        const emoji = await emojiHandler(client, '1134432049852321854');
        const sedCat = await emojiHandler(client, '1134437977842532534');

        await interaction.deferReply();

        await interaction.editReply({
            content: `${sedCat} is the emoji in the file`,
            ephemeral: false,
        });
        await interaction.followUp({
            content: `${emoji} is the emoji in the file`,
            ephemeral: false,
        });
    },
}
