const {Router} = require('express');
const Accessory = require('../models/accessory');
const {authAccess} = require('../services/user');

const router = Router();

router.route('/create/accessory')
    .get(authAccess, (req, res) => {

        res.render('createAccessory', {
            pageTitle: 'Create Accessory',
            isLoggedIn: true
        })
    })
    .post(authAccess, async (req, res) =>{

        const {
            name,
            imageUrl,
            description
        } = req.body;

        try {
            const accessory = new Accessory({
                name,
                imageUrl,
                description
            });

            await accessory.save();
        }

        catch (e) {
            return res.render('CreateAccessory', {
                pageTitle: 'Create Accessory',
                isLoggedIn: true,
                error: 'Invalid data! Try again!'
            });
        }

        res.redirect(301, '/');
    });

module.exports = router;