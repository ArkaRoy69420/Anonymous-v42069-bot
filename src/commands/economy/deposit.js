const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed } = require('../../../command utility/MakeNewUserProfile');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    deleted: false,
    name: 'deposit',
    description: 'Deposit money to your bank account',
    options: [
        {
            name: 'amount',
            description: 'Enter the amount you want to deposit',
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    devOnly: false,
    testOnly: false,

    callback: async (client, interaction) => {
        let userProfile = await UserProfile.findOne({ userID: interaction.member.id });
        if (!userProfile) { // make a new userProfile
            userProfile = new UserProfile({ userID: interaction.member.id });
            interaction.editReply({ embeds: [NewUserProfileEmbed(client)] });
        }

        const amount = interaction.options.getNumber('amount');

        const bankMax = UserProfile.schema.paths.bank.options.max;

        try {
        await interaction.deferReply();
        // checks if amount + amount in bank is not more than max amt possible in bank
        if ((userProfile.bank + amount) > bankMax) { 
            const amountExceedsBankMaxAmt = new EmbedBuilder()
            .setTitle('Can\'t do this')
            .setDescription(`Can't add ${amount} to bank, 'cause ${userProfile.bank}'s max amount will exceed if you add that much!\nYou can add only ${bankMax - userProfile.bank}.`)
            .setColor('Blue')
            .setFooter({ text: 'sed lyf' });

            interaction.editReply({ embeds: [amountExceedsBankMaxAmt] });
            return;
        } else if (amount <= 0 ) { // checks if amount is 0 or less than that
            const amountLessThan0 = new EmbedBuilder()
            .setTitle('Can\'t do this')
            .setDescription(`You added ${amount} to bank? What?`)
            .setColor('Blue')
            .setFooter({ text: 'LOL, do you know \'MATHS\' ?' });
        
            interaction.editReply({ embeds: [amountLessThan0] });
            return;
        } else if (amount > userProfile.balance) { // if amount is more than balance
            const amountMoreThanBalance = new EmbedBuilder()
            .setTitle(`Nope...`)
            .setDescription(`Uhm, your amount is more than your pocket balance(which is ${userProfile.balance}).`)
            .setColor('Blue')
            .setFooter({ text: 'Poor Poor' });

            interaction.editReply({ embeds: [amountMoreThanBalance] });
            return;
        }

        // do the maths
        userProfile.balance = userProfile.balance - amount;
        userProfile.bank = userProfile.bank + amount;

        const newBalance = new EmbedBuilder()
        .setColor('Green')
        .setTitle(`You successfully deposited ${amount} to your bank!`)
        .setDescription(`New Balance:`)
        .addFields(
            {
                name: 'Pocket',
                value: `${userProfile.balance}`,
            },
            {
                name: 'Balance',
                value: `${userProfile.bank}/${bankMax}`,
            },
        );
        interaction.editReply({ embeds: [newBalance] });
        await userProfile.save();
        } catch (error) {
            console.log(`Error in deposit.js file: \n ${error}`);
        }
    },
};