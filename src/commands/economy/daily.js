const { EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {    
    name: 'daily',
    description: 'Collect your daily reward and maintain a streak.',
    devOnly: false,
    testOnly: true,
    callback: async (client, interaction) => {
        const dailyAmount = 10000;

        if (!interaction.inGuild()) {
            interaction.reply({
                content: "This command can only be used in servers!",
                ephmeral: true,
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
            }
            
            // Streak calculation
            const lastCollectedDate = userProfile.lastDailyCollected;
            const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
            const currentStreak = (Date.now() - lastCollectedDate) / oneDay === 1 ? userProfile.streak + 1 : 1;

          userProfile.balance += dailyAmount;
          userProfile.lastDailyCollected = new Date();
          userProfile.streak = currentStreak;

          await userProfile.save();

          const dailyRewardEmbed = new EmbedBuilder()
          .setTitle('Your daily reward')
          .setColor('Aqua')
          .addFields({ name: `Amount collected:`, value: `💷${dailyAmount}` })
          .setFooter({ text: `Streak: ${currentStreak}` });
          interaction.editReply({ embeds: [dailyRewardEmbed] });
        } catch (error) {
            console.error(`Error in daily.js. error\n${error}`);
        }
    },
};
