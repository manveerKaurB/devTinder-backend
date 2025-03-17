const validator = require("validator");
const bcrypt = require("bcrypt");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if(firstName.length <4 || firstName.length > 50) {
        throw new Error("FirstName should be 4-50 characters");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("emailId is not valid");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password");
    }
}

const validateEditProfile = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "age", "gender", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));

    return isEditAllowed;
}

const validateEditPasswordProfile = async (req) => {
    const allowedEditFields = ["password", "newPassword"];
    const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
    const passwordHash = req.user.password;
    const passwordInputbyUser = req.body.password;
    const isPasswordValid = await bcrypt.compare(passwordInputbyUser, passwordHash);
    if(!isPasswordValid) {
       return false;
    }
    else if(!validator.isStrongPassword(req.body.newPassword)) {
        return false;
    }
    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEditProfile, validateEditPasswordProfile};