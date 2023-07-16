const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  description: "returns bot latency to discord",
  testOnly: true,
  callback: async (client, interaction) => {
    try {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp; // calculates latency 

        const pingEmbed = new EmbedBuilder()
        .setTitle(`${client.user.username} pongs!`)
        .setColor('Blue')
        .setDescription('Latencies:')
        .addFields(
            {
                name: 'Client',
                value: `${ping}ms`,
            },
            {
                name: 'Websocket',
                value: `${client.ws.ping}ms`,
            },
        );

        interaction.editReply({ embeds: [pingEmbed] });
    } catch (error) {
        console.error(`Error in /ping \n ${error}`);
    }
  },
};
