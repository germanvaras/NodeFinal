const mongoose = require("mongoose");
const { createHash } = require("../../utils/hashPassword");

const tokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
tokenSchema.pre("save", function (next) {
    const tokenReset = this;
    tokenReset.token = createHash(this.token);
    next();
});
const TokenReset = mongoose.model('tokensReset', tokenSchema);
module.exports = TokenReset;