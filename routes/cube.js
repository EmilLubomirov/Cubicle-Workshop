const {Router} = require('express');
const bodyParser = require('body-parser');
const Cube = require('../models/cube');
const {getCubeById} = require('../services/cubes');

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

router.get('/details/:id', (req, res) =>{

    const id = req.params.id;
    const cube = getCubeById(id);

    res.render('details', {
        ...cube
    });
});

module.exports = router;