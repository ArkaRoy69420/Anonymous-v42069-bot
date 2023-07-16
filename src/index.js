const { Client, IntentsBitField, Partials } = require('discord.js');
require('dotenv/config');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');

const { User, GuildMember, ThreadMember, Message } = Partials

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [User, Message, GuildMember, ThreadMember],
});

(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.mongodb_URI);
        console.log('Successfully connected to mongoDB');
        

    } catch (error) {
        console.error(`Error while connecting to database. Error:\n${error}`)
    }
})();

eventHandler(client);
client.login(process.env.token);