const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed } = require('../../../command utility/MakeNewUserProfile');
const getChanceNumber = require('../../../command utility/RandomNumber');

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    deleted: false,
    name: 'coin-flip',
    description: 'Take part in a game of coinflip with equal chances of losing and winning.',
    options: [
        {
            name: 'amount',
            description: 'Choose the amount you want to bet',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
        {
            name: 'options',
            description: 'Choose head or tails.',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Heads',
                    value: 'heads',
                },
                {
                    name: 'Tails',
                    value: 'tails',
                },
            ],
        },
    ],
    devOnly: false,
    testOnly: false,
    callback: async (client, interaction) => {
        let userProfile = await UserProfile.findOne({ userID: interaction.member.id });

        if (!userProfile) {
            userProfile = new UserProfile({ userID: interaction.member.id });
            await interaction.reply({ embeds: [NewUserProfileEmbed(client)] });
            return;
        } 

        try {
            await interaction.deferReply();

            const chance = getChanceNumber(0, 100);

            const amount = interaction.options.getNumber('amount');
            const AmountWin = amount * 2;
            const optionHeadOrTail= interaction.options.getString('options');

            // amount user bets is less than 0
            if (amount < 0) {
                let AmountIs0 = new EmbedBuilder()
                .setTitle(`What da ${interaction.user.username} doin' ?`)
                .setColor('Red')
                .setDescription(`You can definitely not bet ${amount}. You ever heard of \'Maths\'?`)
                .setFooter({ text: 'Imagine being so dumb' });

                interaction.editReply({ embeds: [AmountIs0] });

                return;
            } else if (amount > userProfile.balance) {
                const amountGreaterThanMaxAmount = new EmbedBuilder()
                .setTitle('You are poorer!')
                .setDescription('You don\'t have that much moni in your balance!')
                .setColor('Red')
                .setFooter({ text: 'sed lyf' });

                interaction.editReply({ embeds: [amountGreaterThanMaxAmount] });

                return;
            } else if (amount > 3000000) {
                const amountGreaterThanBalance = new EmbedBuilder()
                .setTitle('Maximum amount exceeded... ')
                .setDescription('You can\'t bet more than 3,000,000')
                .setColor('Red')
                .setFooter({ text: 'sed lyf' });

                interaction.editReply({ embeds: [amountGreaterThanBalance] });

                return;
            }

            function LoseFunction() {
                if (optionHeadOrTail === 'heads') {
                    let oppositeOfHeads = "tails";
                    return oppositeOfHeads;
                } else if (optionHeadOrTail === 'tails') {
                    let oppositeOfTails = "heads";
                    return oppositeOfTails;
                }
            }

            if (chance <= 45) {
                userProfile.balance = userProfile.balance + AmountWin;

                await userProfile.save();

                const rewardEmbed = new EmbedBuilder()
                .setTitle('You won!')
                .setColor('Green')
                .setDescription(`The coin tossed and it fell on ${optionHeadOrTail}! You recieved 💷${AmountWin}.`)
                .setFooter({ text: `New Balance: ${userProfile.balance}`});

                interaction.editReply({ embeds: [rewardEmbed] });
            } else {
                const rewardEmbed = new EmbedBuilder()
                .setTitle('You lose!')
                .setColor('Red')
                .setDescription(`The coin tossed and it fell on ${LoseFunction()}! Sad!`)
                .setFooter({ text: `loser loser`});

                interaction.editReply({ embeds: [rewardEmbed] });
                userProfile.balance = userProfile.balance - amount;

                await userProfile.save();
            }
        
        } catch (error) {
            console.error(`Error in coinflip.js file:\n${error}`)
        }
    },
};