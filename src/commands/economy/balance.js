
const { Interaction, Client, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed, NO_userProfile }= require('../../../command utility/MakeNewUserProfile');

module.exports = {
    /** 
     * @param {Client} client
     * @param {Interaction} interaction
    */

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
    callback: async (client, interaction) => {
        const targetUser = interaction.options.get('target-user')?.value || interaction.member.id; 
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

            let balanceEmbed;
            if (targetUser == interaction.member.id) {
                balanceEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s balance`)
                .setColor('Blue')
                .setDescription(`Your Balance:`)
                .addFields(
                    {
                        name: 'Pocket',
                      value: `${userProfile.balance}`
                    },
                    {
                        name: 'Bank',
                        value: `${userProfile.bank}`
                    },
                );
            } else {
                const { bank: { max } } = UserProfile.schema.paths;
                balanceEmbed = new EmbedBuilder()
                .setTitle(`${targetUser}'s balance`)
                .setColor('Blue')
                .setDescription(`Your Balance:`)
                .addFields(
                    {
                        name: 'Pocket',
                        value: `💷${userProfile.balance}`
                    },
                    {
                        name: '🏦Bank',
                     value: `💷${userProfile.bank}/${max}`
                    },
                );
            }
            interaction.editReply({ embeds: [balanceEmbed] });
        } catch (err) {
            console.error(`Error in balance.js file. Error:\n${err}`);
        }
    }
}