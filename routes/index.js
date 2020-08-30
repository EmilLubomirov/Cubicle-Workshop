const {Router} = require('express');
const {getAllCubes} = require('../services/cubes');

const router = Router();

router.get('/', (req, res) =>{

    const cubes = getAllCubes();

    res.render('index', {
        cubes
    });
});

router.get('/about', (req, res) =>{
   res.render('about');
});

module.exports = router;