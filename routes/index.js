const {Router} = require('express');
const url = require('url');
const router = Router();

const {getAllCubes} = require('../services/cubes');
const {filterCubesByCriteria} = require('../services/cubes');
const {getUserStatus} = require('../services/user');

router.get('/', getUserStatus,  async (req, res) =>{

    let cubes = await getAllCubes();

    const reqURL = url.parse(req.url, true);
    const regex = /\/\?search=.*&from=-*\d*&to=-*\d*/gi;

    if (RegExp(regex).test(reqURL.path)){

        const query = reqURL.query;
        const {search, from, to} = query;
        cubes = await filterCubesByCriteria(cubes, search, from, to);
    }

    res.render('index', {
        pageTitle: 'Home',
        cubes,
        isLoggedIn: req.isLoggedIn
    });
});

router.get('/about', getUserStatus, (req, res) =>{

   res.render('about', {
       pageTitle: 'About',
       isLoggedIn: req.isLoggedIn
   });
});

module.exports = router;