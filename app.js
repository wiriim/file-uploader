const express = require('express');
const app = express();
require('dotenv').config();

// Set up views configuration
const path = require('node:path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up routes
const mainRouter = require('./routes/mainRouter');
app.use('/', mainRouter);

// Set up running application
const PORT = process.env.DEFAULT_PORT
app.listen(PORT, (err) => {
    if (err){
        throw err;
    }

    console.log(`Application is listening on port ${PORT}`);
});
