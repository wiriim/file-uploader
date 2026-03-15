const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.DEFAULT_PORT
app.listen(PORT, (err) => {
    if (err){
        throw err;
    }

    console.log(`Application is listening on port ${PORT}`);
});
