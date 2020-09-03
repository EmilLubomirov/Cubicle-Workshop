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

        const cube = new Cube({name,
            description,
            imageUrl,
            difficulty: difficultyLevel
        });
        console.log(cube);
        cube.save();

        res.redirect(301, '/');
    });

router.get('/details/:id', async (req, res) =>{

    const id = req.params.id;
    const cube = await getCubeById(id);

    res.render('details', {
        ...cube
    });
});

module.exports = router;