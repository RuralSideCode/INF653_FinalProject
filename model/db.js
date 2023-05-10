const mongoose = require('mongoose');

const connectDB = async () => {
    console.log(process.env.MONGODB_URL);
    try {
        console.log("Connecting to MongoDB database...");
        await mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Connection Successful!");
    } catch(err) {
        console.log("Connection Error. Exiting.");
        console.error(err);
        process.exit(1);
    }
}

const StateSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String],
        required: false
    }
});

module.exports = {connectDB, States: new mongoose.model("State", StateSchema)};