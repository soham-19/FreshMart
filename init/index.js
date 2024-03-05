const mongoose = require('mongoose');

const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/';
const DB = 'wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL + DB);
};


main()
    .then(() => {
        console.log("mongo-db and express connection successful");
    })
    .catch(err => {
        console.log(`Error : ${err.message}`);
    });


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();