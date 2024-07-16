const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("DB is Connected"))
    .catch(err => console.log("DB not Connected ",err));