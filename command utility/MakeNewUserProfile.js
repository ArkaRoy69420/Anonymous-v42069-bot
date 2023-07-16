const { EmbedBuilder } = require('discord.js');
function NO_userProfile() {
    const NO_userProfile = new EmbedBuilder()
    .setTitle('Uh Oh...')
    .setColor('Red')
    .setDescription(`'Sorry, the user doesn't have a User Profile in the database`);

    return NO_userProfile;
}
function NewUserProfileEmbed(client) {
    const NewUserProfileEmbed = new EmbedBuilder()
    .setTitle(`Welcome to ${client.user.username}'s game!`)
    .setColor('Blue')
    .setDescription('New user profile has been made for you. Run the command again to check your balance.');

    return NewUserProfileEmbed;
}

module.exports = { NewUserProfileEmbed, NO_userProfile };