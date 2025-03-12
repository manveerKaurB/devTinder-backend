const validator = require("validator");
const validateSignUpData = (req) => {
    console.log(req.body);
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
        console.log(password);
        throw new Error("Please enter a strong Password");
    }
}

module.exports = {validateSignUpData};