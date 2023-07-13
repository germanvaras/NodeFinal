const mongoose = require("mongoose");
require("dotenv").config();
const conection = process.env.db;
mongoose.connect(conection, error => {
    if (error) {
        process.exit()
    }
})
