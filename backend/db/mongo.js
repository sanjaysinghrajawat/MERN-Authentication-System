const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, { dbName: "mern-auth" })
    .then(() => console.log("DB is Connected"))
    .catch(err => console.log("DB not Connected ",err));