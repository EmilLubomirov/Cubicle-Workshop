const {Router} = require('express');
const url = require('url');
const router = Router();

const {getAllCubes} = require('../services/cubes');
const {filterCubesByCriteria} = require('../services/cubes');

router.get('/', (req, res) =>{

    let cubes = getAllCubes();

    const reqURL = url.parse(req.url, true);
    const regex = /\/\?search=.*&from=\d*&to=\d*/gi;

    if (RegExp(regex).test(reqURL.path)){
        const query = reqURL.query;
        const {search, from, to} = query;
        cubes = filterCubesByCriteria(cubes, search, from, to);
    }

    res.render('index', {
        cubes
    });
});

router.get('/about', (req, res) =>{
   res.render('about');
});

module.exports = router;