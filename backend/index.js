const express = require('express');
const app = express();
require('dotenv').config()
require('./db/mongo')
const router = require('./routes/user');
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.use('/api/user', router);
const PORT = process.env.PORT || 8000
app.listen(8000, () => {
    console.log(`App is running on port ${PORT}`);
})