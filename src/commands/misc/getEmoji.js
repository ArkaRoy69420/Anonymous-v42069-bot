const { ApplicationCommandOptionType } = require('discord.js');

let arrayOfEmojis = [];

module.exports = {
    name: 'upload-emoji',
    description: 'Upload an emoji to the bot. For only devs in test server.',
    deleted: true,
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'emoji',
            description: 'Emoji to upload.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    // this command is deleted bruh what are u gon read further?!
    callback: async (client, interaction) => {
        const emojiName = await interaction.options.getString('emoji').value;
        const emoji = await interaction.guild.emojis.cache.find(
            (emoji) => emoji.name === emojiName && emoji.name
        );
        
        if (emoji) {
            await interaction.reply({
                content: `${emoji}`,
                ephemeral: false,
            });
            arrayOfEmojis.push(emoji);
            console.log(arrayOfEmojis);
        } else {
            await interaction.reply({
                content: 'Emoji not found.',
                ephemeral: false,
            });
        }
    },
}

module.exports.emojis = arrayOfEmojis;