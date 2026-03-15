const express = require("express");
const app = express();
require("dotenv").config();

// Set up views configuration
const path = require("node:path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up session & passport
require("./passport/passport");
const session = require("express-session");
const passport = require("passport");
const prisma = require("./lib/prisma");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        secret: "idctopsecret",
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);
app.use(passport.session());

// Set up routes
app.use(express.urlencoded({ extended: false }));
const mainRouter = require("./routes/mainRouter");
app.use("/", mainRouter);

// Set up running application
const PORT = process.env.DEFAULT_PORT;
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Application is listening on port ${PORT}`);
});
