const { Interaction, Client, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed, NO_userProfile }= require('../../../command utility/MakeNewUserProfile');

module.exports = {
    /** 
     * @param {Client} client
     * @param {Interaction} interaction
    */

    deleted: false,
    name: 'check-streak',
    description: 'Check your or another user\'s streak.',
    devOnly: true,
    testOnly: true,
    options: [
        {
            name: 'check-streak',
            description: 'Check your daily streak.',
            required: false,
            type: ApplicationCommandOptionType.User
        }
    ],
    callback: async (client, interaction) => {
        const targetUser = interaction.options.get('check-streak')?.value || interaction.member.id; 
        try {
            await interaction.deferReply();
            
            let userProfile = await UserProfile.findOne({ userID: targetUser });
            if (!userProfile) { 
                if (targetUser == interaction.member.id) {
                    userProfile = new UserProfile({ userID: targetUser });
                    interaction.editReply({ embeds: [NewUserProfileEmbed(client)] });
                } else {
                    interaction.editReply({ embeds: [NO_userProfile()] })
                }
            }

            let streakEmbed; 
            if (targetUser !== interaction.member.id) {
                streakEmbed = new EmbedBuilder()
                .setTitle(`${targetUser.user.username}'s daily streak`)
                .setColor('Blue')
                .addFields({ name: 'Streak', value: `${userProfile.streak}` });

                interaction.editReply({ embeds: [streakEmbed] });
            } else if (targetUser == interaction.member.id) {
                streakEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s daily streak`)
                .setColor('Blue')
                .addFields({ name: 'Streak', value: `${userProfile.streak}` });
                
                interaction.editReply({ embeds: [streakEmbed] });
            }
        } catch (err) {
            console.error(`Error in check-streak file. Error:\n${err}`);
        }
    }
}