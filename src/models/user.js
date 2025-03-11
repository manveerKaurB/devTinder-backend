const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png"
    },
    about: {
        type: String,
        default: "This is default description"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});
const User = mongoose.model("User", userSchema);
module.exports = User;