const {Router} = require('express');
const bodyParser = require('body-parser');
const Cube = require('../models/cube');
const Accessory = require('../models/accessory');
const {getCubeById, getCubeByIdWithAccessories} = require('../services/cubes');
const {getAvailableAccessories} = require('../services/accessories');

const router = Router();

router.route('/create')
    .get((req, res) =>{
        res.render('create');
    })
    .post(async (req, res) =>{
        const {name, description, imageUrl, difficultyLevel} = req.body;

        const cube = new Cube({
            name,
            description,
            imageUrl,
            difficulty: difficultyLevel
        });

        await cube.save();

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

    const cubeId = req.params.id;
    const cube = await getCubeById(cubeId);
    const accessories = await getAvailableAccessories(cube.accessories, cubeId);

    res.render('attachAccessory', {
        ...cube,
        accessories
    });
})
    .post(async (req, res) =>{

        const id = req.params.id;
        const accessoryId = req.body.accessory;

        await Cube.findOneAndUpdate({_id: id}, {
            $addToSet: {accessories: accessoryId}
        }, err =>{
            if (err){
                console.error(err);
                throw err;
            }
        });

       await Accessory.findOneAndUpdate({_id: accessoryId}, {
            $addToSet: {cubes: id}
        }, err =>{
            if (err){
                console.error(err);
                throw err;
            }
        });

        res.redirect(301, `/details/${id}`);
    });

module.exports = router;