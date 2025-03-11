const mongoose = require("mongoose");
const validator = require("validator");
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
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid emailId");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("password is not strong");
            }
        }
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
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid photoUrl");
            }
        }
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