const { Router } = require("express");
const mainRouter = new Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const prisma = require("../lib/prisma");

mainRouter.get("/", async (req, res) => {
    res.locals.currentUser = req.user;
    const files = await prisma.file.findMany({
        where: {userId: req.user.id}
    });
    console.log(files)
    res.render("homePage", {files});
});

mainRouter.get("/login", (req, res) => {
    res.render("loginPage", { errors: req.session.messages });
});

mainRouter.post(
    "/login",
    (req, res, next) => {
        delete req.session.messages;
        next();
    },
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true,
    })
);

mainRouter.get("/signup", (req, res) => {
    res.render("signUpPage");
});

mainRouter.post("/signup", authController.signUp);

mainRouter.get("/logout", authController.logout);

// Files
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const path = require('node:path');
const http = require('http');

mainRouter.post("/upload", upload.single("file"), async (req, res) => {
    console.log(req.file, req.body);
    await prisma.file.create({
        data: {
            name: req.file.filename,
            alias: req.file.originalname,
            user: {
                connect: { id: req.user.id },
            },
        },
    });
    res.redirect("/");
});

mainRouter.get('/download/:file', (req, res) => {
    const filename = req.params.file;
    const rootDir = path.dirname(process.argv[1]);
    const dest = path.join(rootDir, '/uploads', filename);

    res.download(dest);
});

module.exports = mainRouter;
