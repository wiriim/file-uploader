const { Router } = require('express');
const mainRouter = new Router();

mainRouter.get('/', (req, res) => {
    res.render('homePage');
});

mainRouter.get('/login', (req, res) => {
    res.render('loginPage');
});

mainRouter.get('/signup', (req, res) => {
    res.render('signUpPage');
});


module.exports = mainRouter;