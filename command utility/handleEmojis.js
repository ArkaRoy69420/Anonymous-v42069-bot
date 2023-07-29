require('dotenv/config');
module.exports = async (client, emoji_ID) => {
    const guild = await client.guilds.cache.get(process.env.guild_for_emoji);
    const emoji = await guild.emojis.cache.get(emoji_ID);
    if (!emoji) {
        if (!guild) {
            return console.error(`The guild doesn't really exist... Go and check the .env file instead of scratching head.`);
        }
        return console.error(`The emoji doesn't exist.`);
    } else {
        return emoji;
    }
};