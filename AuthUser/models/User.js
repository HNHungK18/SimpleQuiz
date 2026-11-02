const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        default: "",
        unique: true,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);