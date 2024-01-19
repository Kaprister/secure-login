const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

const DB_URL = process.env.MONGODB_URL;

exports.connect = () => {
    mongoose.connect(DB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    } )
};
