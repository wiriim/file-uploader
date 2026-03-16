const { Router } = require("express");
const mainRouter = new Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const prisma = require("../lib/prisma");

mainRouter.get("/", async (req, res) => {
    res.locals.currentUser = req.user;
    let files = [];
    if (req.user) {
        files = await prisma.file.findMany({
            where: { userId: req.user.id },
        });
    }

    res.render("homePage", { files });
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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");
const path = require("node:path");
const http = require("http");
const { decode } = require("base64-arraybuffer");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

mainRouter.post("/upload", upload.single("file"), async (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ message: "Please upload a file" });
        return;
    }
    const fileBuffer = req.file.buffer;
    const fileBase64 = decode(fileBuffer.toString("base64"));
    
    const { data, error } = await supabase.storage
        .from("files/" + req.user.username)
        .upload(
            req.file.originalname,

            fileBase64,
            {
                contentType: req.file.mimetype,
            }
        );
    if (error) {
        next(error);
    } else {
        await prisma.file.create({
            data: {
                name: data.path,
                alias: req.file.originalname,
                user: {
                    connect: { id: req.user.id },
                },
            },
        });
        res.redirect("/");
    }
});

mainRouter.get("/download", (req, res) => {
    const { data } = supabase.storage
        .from("files/" + req.user.username)
        .getPublicUrl(req.query.file + '?download=' + req.query.file);

    res.redirect(data.publicUrl);
});

module.exports = mainRouter;
