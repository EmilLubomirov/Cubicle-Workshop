const {Router} = require('express');
const Accessory = require('../models/accessory');
const router = Router();

router.route('/create/accessory')
    .get((req, res) => res.render('createAccessory'))
    .post(async (req, res) =>{

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