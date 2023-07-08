const mongoose = require("mongoose");
require("dotenv").config();
const conection = process.env.db;
mongoose.connect(conection, error => {
    if (error) {
        console.log('Cannot connect to db')
        process.exit()
    }
})
