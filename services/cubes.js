const fs = require('fs');

const cubeStoragePath = __dirname + '/..' + '/config/database.json';
const Cube = require('../models/cube');

const getAllCubes = async () =>{
    return await Cube.find().lean();
};

const filterCubesByName = (cubes, search) =>{

    if (!search){
        return cubes;
    }

    return  cubes.filter(c => c.name.toLowerCase()
                        .includes(search.toLowerCase()));
};

const filterCubesByLowerBoundDifficulty = (cubes, from) => {

    if (!from){
        return cubes;
    }

    return  cubes.filter(c => c.difficulty >= Number(from));

};

const filterCubesByUpperBoundDifficulty = (cubes, to) => {

    if (!to){
        return cubes;
    }

    return  cubes.filter(c => c.difficulty <= Number(to));

};

const filterCubesByCriteria = (cubes, search, from, to) =>{

    cubes = filterCubesByName(cubes, search);
    cubes = filterCubesByLowerBoundDifficulty(cubes, from);
    cubes = filterCubesByUpperBoundDifficulty(cubes, to);

    return cubes;
};

const getCubeById = async (id) =>{
    return await Cube.findById(id).lean();
};

const getCubeByIdWithAccessories = async (id) => {
    return await Cube.findById(id).populate('accessories').lean();
};

const saveCubeInFile = (cube) =>{

    fs.readFile(cubeStoragePath, (err, data) =>{

        data = JSON.parse(data);
        data.push(cube);

        fs.writeFile(cubeStoragePath, JSON.stringify(data), 'utf-8', (err) =>{
            if (err){
                throw err;
            }
        })
    });
};

module.exports = {
    getAllCubes,
    filterCubesByCriteria,
    getCubeById,
    getCubeByIdWithAccessories,
    saveCubeInFile
};