const {Router} = require('express');
const bodyParser = require('body-parser');
const Cube = require('../models/cube');
const Accessory = require('../models/accessory');
const {getCubeById, getCubeByIdWithAccessories, validateCube} = require('../services/cubes');
const {getAvailableAccessories} = require('../services/accessories');
const {authAccess, creatorAccess} = require('../services/user');

const router = Router();

router.route('/create')
    .get(authAccess, (req, res) =>{
        res.render('create', {
            pageTitle: 'Create Cube',
            isLoggedIn : true
        });
    })
    .post(authAccess, async (req, res) =>{
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
            return res.render('create', {
                pageTitle: 'Create Accessory',
                isLoggedIn: true,
                error: 'Invalid data! Try again!'
            });
        }

        res.redirect(301, '/');
    });

router.get('/details/:id', authAccess, async (req, res) =>{

    const id = req.params.id;
    const cube = await getCubeByIdWithAccessories(id);

    const isCreator = cube.creatorId &&
        cube.creatorId.valueOf().toString() === req.userId.valueOf().toString();

    res.render('details', {
        pageTitle: 'Details',
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
        pageTitle: 'Attach Accessory',
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
            pageTitle: 'Edit',
            isLoggedIn: true,
            ...req.cube
        })
    })
    .post(creatorAccess, async (req, res) =>{

        const {name, description, imageUrl, difficultyLevel} = req.body;

        const {error} = validateCube(req.body);

        if (error){
            return res.render('editCubePage', {
                pageTitle: 'Edit',
                isLoggedIn: true,
                error
            })
        }

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
            pageTitle: 'Delete',
            isLoggedIn: true,
            ...req.cube
        })
    })
    .post(creatorAccess, async (req, res) =>{

        await Cube.findByIdAndDelete(req.params.id);
        res.redirect(301, '/');
    });

module.exports = router;