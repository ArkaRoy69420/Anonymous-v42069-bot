require('dotenv/config');
const { Interaction, Client, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed, NO_userProfile }= require('../../../command utility/MakeNewUserProfile');
const emojiHandler = require('../../../command utility/handleEmojis');

module.exports = {
    deleted: false,
    name: 'balance',
    description: 'Check your or another user\'s streak.',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'target-user',
            description: 'Choose the user whose balance you want to check.',
            required: false,
            type: ApplicationCommandOptionType.User
        }
    ],
    /** 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const targetUser = interaction.options.get('target-user')?.value || interaction.member.id; 
        const targetUserName = interaction.options.get('target-user')?.user || interaction.user;
        const pepeMoneyRain = await emojiHandler(client, '1134432049852321854'); // the right one

        try {
            await interaction.deferReply();
            
            let userProfile = await UserProfile.findOne({ userID: targetUser });
            if (!userProfile) { 
                if (targetUser == interaction.member.id) {
                    userProfile = new UserProfile({ userID: targetUser });
                    interaction.editReply({ embeds: [NewUserProfileEmbed(client)] });
                    await userProfile.save();
                    return;
                } else {
                    interaction.editReply({ embeds: [NO_userProfile()] })
                    return;
                }
            }

            const bankMax = await userProfile.schema.paths.bank.options.max;
            balanceEmbed = new EmbedBuilder()
            .setTitle(`${targetUserName.username}'s balance`)
            .setColor('Blue')
            .setDescription(`Balance:`)
            .addFields(
                { name: `${pepeMoneyRain} Pocket`, value: `💷${userProfile.balance}` },
                { name: '🏦 Bank', value: `💷${userProfile.bank}/${bankMax}` },
            );
            interaction.editReply({ embeds: [balanceEmbed] });
        } catch (err) {
            console.error(`Error in balance.js file. Error:\n${err}`);
        }
    }
}