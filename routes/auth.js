const {Router} = require('express');
const {saveUser, authenticateUser, getUserStatus} = require('../services/user');

const router = Router();

router.route('/register')
    .get(getUserStatus, (req, res) => {

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        res.render('registerPage', {
            pageTitle: 'Register',
        })
    })
    .post(getUserStatus, async (req, res) =>{

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        const user = await saveUser(req, res);

        if (!user){
              return res.render('registerPage', {
                pageTitle: 'Register',
                error: 'Invalid username or password'
            });
        }

        res.redirect(301, '/');
    });

router.route('/login')
    .get(getUserStatus, (req, res) => {

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        return res.render('loginPage', {
            pageTitle: 'Login',
        })
    })
    .post(getUserStatus, async (req, res) =>{

        if (req.isLoggedIn){
            return res.redirect(301, '/');
        }

        const user = await authenticateUser(req, res);

        if (!user){
             res.render('loginPage', {
                pageTitle: 'Login',
                error: 'Invalid username or password'
            });
        }

        res.redirect(301, '/');
    });

router.get('/log-out', (req, res) =>{

    res.clearCookie('aid');
    res.redirect(301, '/');
});


module.exports = router;