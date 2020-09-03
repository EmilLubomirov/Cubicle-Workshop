const {Router} = require('express');
const bodyParser = require('body-parser');
const Cube = require('../models/cube');
const {getCubeById, getCubeByIdWithAccessories} = require('../services/cubes');
const {getAvailableAccessories} = require('../services/accessories');

const router = Router();

router.route('/create')
    .get((req, res) =>{
        res.render('create');
    })
    .post((req, res) =>{
        const {name, description, imageUrl, difficultyLevel} = req.body;

        const cube = new Cube({
            name,
            description,
            imageUrl,
            difficulty: difficultyLevel
        });
        cube.save();

        res.redirect(301, '/');
    });

router.get('/details/:id', async (req, res) =>{

    const id = req.params.id;
    const cube = await getCubeByIdWithAccessories(id);

    res.render('details', {
        ...cube
    });
});

router.route('/attach/accessory/:id')
    .get(async (req, res) =>{

    const id = req.params.id;
    const cube = await getCubeById(id);
    const accessories = await getAvailableAccessories(cube.accessories);

    res.render('attachAccessory', {
        ...cube,
        accessories
    });
})
    .post((req, res) =>{

        const id = req.params.id;
        const accessoryId = req.body.accessory;

        Cube.findOneAndUpdate({_id: id}, {
            $addToSet: {accessories: accessoryId}
        }, err =>{
            if (err){
                console.error(err);
                throw err;
            }
        });

        res.redirect(301, `/details/${id}`);
    });

module.exports = router;