const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

async function signUp(req, res, next) {
    const username = req.body.username;
    const user = await prisma.user.findUnique({
        where: { username },
    });
    if (user) {
        return res.render("signUpPage", { error: "Username has been taken" });
    }

    const password = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
        data: {
            username,
            password,
        },
    });
    res.redirect("/login");
}

function logout(req, res) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

module.exports = {
    signUp,
    logout,
};
