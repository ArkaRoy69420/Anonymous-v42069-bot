const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');
const { NewUserProfileEmbed } = require('../../../command utility/MakeNewUserProfile');

module.exports = {    
    name: 'daily',
    description: 'Collect your daily reward and maintain a streak.',
    devOnly: false,
    testOnly: true,
    callback: async (client, interaction) => {
        const dailyAmount = 10000;

        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command can only be used in servers!",
                ephemeral: true,
            });
            return;
        }

        try {
          const cooldownEmbed = new EmbedBuilder()
          .setTitle('Woah Woah, slow it down man :<')
          .setColor('Red')
          .addFields({ name: 'You already ran /daily !', value: `Run your command tomorrow again for reward!` });

          await interaction.deferReply();

          let userProfile = await UserProfile.findOne({ userID: interaction.member.id });

            if (userProfile) {
                const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    interaction.editReply({ embeds: [cooldownEmbed] });
                    return;
                }
            } else {
                userProfile = new UserProfile({ userID: interaction.member.id });
                interaction.editReply({ embeds: [NewUserProfileEmbed(client)] });
                await userProfile.save();
                return;
            }
            // calculation if the user has run /daily ever before
            let firstDaily = userProfile.streak === 0 ? true : false;

            // Streak calculation
            const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
            if ((Date.now() - userProfile.lastDailyCollected)/oneDay >= 1 && (Date.now() - userProfile.lastDailyCollected)/oneDay < 2) {
                userProfile.streak = userProfile.streak + 1;
            } else if (Date.now() - userProfile.lastDailyCollected >= 2) {
                userProfile.streak = 1;
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();
            await userProfile.save();

            const dailyRewardEmbed = new EmbedBuilder()
            .setTitle('Your daily reward')
            .setColor('Aqua')
            .addFields({ name: `Amount collected:`, value: `💷${dailyAmount}` })
            .setFooter({ text: `Streak: ${userProfile.streak}` });

            interaction.followUp({ embeds: [dailyRewardEmbed] });

            if (!firstDaily) {
                interaction.editReply({ content: 'You did not run daily for 2 or more days. Therefore, you lost your streak.', ephemeral: true });
            }
        } catch (error) {
            console.error(`Error in daily.js. error\n${error}`);
        }
    },
};
