const {Router} = require('express');
const bodyParser = require('body-parser');
const Cube = require('../models/cube');

const router = Router();

router.route('/create')
    .get((req, res) =>{
        res.render('create');
    })
    .post((req, res) =>{
        const {name, description, imageUrl, difficultyLevel} = req.body;
        const cube = new Cube(name, description, imageUrl, difficultyLevel);
        cube.save();

        res.redirect(301, '/');
    });

module.exports = router;