const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://manveerkaur2906:52K0aPAVzjNfJCpC@manveerdb.fqmrc.mongodb.net/devTinder");
}

module.exports = { connectDB };