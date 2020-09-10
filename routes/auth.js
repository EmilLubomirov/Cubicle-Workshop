const {Router} = require('express');
const {saveUser, authenticateUser, getUserStatus, authAccess} = require('../services/user');

const router = Router();

router.route('/sign-up')
    .get(getUserStatus, (req, res) => {

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        res.render('registerPage')
    })
    .post(getUserStatus, async (req, res) =>{

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        const user = await saveUser(req, res);

        if (!user){
            return res.redirect(301, '/sign-up');
        }

        res.redirect(301, '/');
    });

router.route('/sign-in')
    .get(getUserStatus, (req, res) => {

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        res.render('loginPage')
    })
    .post(getUserStatus, async (req, res) =>{

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        const user = await authenticateUser(req, res);

        if (!user){
            return res.redirect(301, '/login');
        }

        res.redirect(301, '/');
    });

router.get('/sign-out', (req, res) =>{

    res.clearCookie('auth');
    res.redirect(301, '/');
});


module.exports = router;