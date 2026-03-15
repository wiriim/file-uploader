const { Router } = require("express");
const mainRouter = new Router();
const authController = require("../controllers/authController");
const passport = require("passport");

mainRouter.get("/", (req, res) => {
    res.locals.currentUser = req.user;
    res.render("homePage");
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

module.exports = mainRouter;
