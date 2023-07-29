const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed } = require('../../../command utility/MakeNewUserProfile');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    deleted: false,
    name: 'withdraw',
    description: 'Withdraw money from your bank',
    devOnly: false,
    testOnly: true,
    options: [
        {
            name :'amount',
            description: 'Amount to withdraw',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        let userProfile = await UserProfile.findOne({ userID: interaction.member.id });
        if (!userProfile) {
            userProfile = new UserProfile({ userID: interaction.member.id });
        } else {
            try {
                await interaction.deferReply();

                const amount = interaction.options.getNumber('amount');

                const successEmbed = new EmbedBuilder()
                .setTitle('Success!')
                .setDescription(`Successfully withdrawn ${amount} from acc`);
                await interaction.editReply({ embeds: [successEmbed] });
            } catch (error) {
                console.error(`Error in js file, eror: \n ${error}`)
            }
        }
    },
}