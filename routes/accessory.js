const {Router} = require('express');
const Accessory = require('../models/accessory');
const {authAccess} = require('../services/user');

const router = Router();

router.route('/create/accessory')
    .get(authAccess, (req, res) => res.render('createAccessory', {
        isLoggedIn: true
    }))
    .post(authAccess, async (req, res) =>{

        const {
            name,
            imageUrl,
            description
        } = req.body;

        const accessory = new Accessory({
            name,
            imageUrl,
            description
        });

        await accessory.save();

        res.redirect(301, '/');
    });

module.exports = router;