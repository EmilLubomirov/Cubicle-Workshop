const {Router} = require('express');
const bodyParser = require('body-parser');
const Cube = require('../models/cube');
const Accessory = require('../models/accessory');
const {getCubeById, getCubeByIdWithAccessories} = require('../services/cubes');
const {getAvailableAccessories} = require('../services/accessories');
const {authAccess, getUserStatus, creatorAccess} = require('../services/user');

const router = Router();

router.route('/create')
    .get(authAccess, (req, res) =>{
        res.render('create', {
            isLoggedIn : true
        });
    })
    .post(authAccess, getUserStatus, async (req, res) =>{
        const {name, description, imageUrl, difficultyLevel} = req.body;

        try{
            const cube = new Cube({
                name,
                description,
                imageUrl,
                difficulty: difficultyLevel,
                creatorId: req.userId
            });

            await cube.save();
        }

        catch (e) {
            return res.redirect(301, '/create');
        }

        res.redirect(301, '/');
    });

router.get('/details/:id', authAccess, getUserStatus, async (req, res) =>{

    const id = req.params.id;
    const cube = await getCubeByIdWithAccessories(id);

    const isCreator = cube.creatorId &&
        cube.creatorId.valueOf().toString() === req.userId.valueOf().toString();

    res.render('details', {
        ...cube,
        isCreator,
        isLoggedIn: true
    });
});

router.route('/attach/accessory/:id')
    .get(authAccess, async (req, res) =>{

    const cubeId = req.params.id;
    const cube = await getCubeById(cubeId);
    const accessories = await getAvailableAccessories(cube.accessories, cubeId);

    res.render('attachAccessory', {
        ...cube,
        accessories,
        isLoggedIn: true
    });
})
    .post(authAccess, async (req, res) =>{

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

router.route('/edit/:id')
    .get(creatorAccess, (req, res) =>{

        res.render('editCubePage', {
            isLoggedIn: true,
            ...req.cube
        })
    })
    .post(creatorAccess, async (req, res) =>{

        const {name, description, imageUrl, difficultyLevel} = req.body;

        await Cube.findByIdAndUpdate(req.params.id, {
            name,
            description,
            imageUrl,
            difficulty: difficultyLevel
        });

        res.redirect(301, '/');
    });

router.route('/delete/:id')
    .get(creatorAccess, (req, res) =>{

        res.render('deleteCubePage', {
            isLoggedIn: true,
            ...req.cube
        })
    })
    .post(creatorAccess, async (req, res) =>{

        await Cube.findByIdAndDelete(req.params.id);
        res.redirect(301, '/');
    });

module.exports = router;