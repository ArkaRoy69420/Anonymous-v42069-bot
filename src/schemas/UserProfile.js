const { model, Schema } = require('mongoose');

const UserProfileSchema = new Schema({
    userID: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    bank: {
        type: Number,
        max: 10000,
        default: 0,
    },
    lastDailyCollected: {
        type: Date,
        default: null,
    },
    streak: {
        type: Number,
        default: 0,
    },
},
{ timestamps: true });

module.exports = model("UserProfile", UserProfileSchema);