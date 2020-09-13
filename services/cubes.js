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

    return cubes.filter(c => c.difficulty >= Number(from));

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

const validateCubeName = (name) =>{

    if (!name || name.length < 5){
        return{
            error: 'Name should be at least 5 symbols'
        }
    }

    if (!RegExp('[a-zA-Z0-9 ]+').test(name)){
        return  {
            error: 'Name should contain English letters, digits or whitespaces only'
        }
    }

    return 'Name is valid';
};

const validateCubeDescription = (description) =>{

    const descLength = description.length;

    if (descLength < 20 || descLength > 2000){
        return {
            error: 'Description should be between 20 and 2000 symbols'
        };
    }

    if (!RegExp(/[a-zA-Z0-9 ]+/).test(description)){
        return  {
            error: 'Description should contain English letters, digits or whitespaces only'
        }
    }

    return 'Description is valid';
};

const validateCubeImageUrl = (imageUrl) =>{

    if (!(imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))){
        return {
            error: 'Image URL should start with http:// or https://'
        }
    }

    return 'Image URL is valid';
};


const validateCube = (cube) =>{

    const {name, description, imageUrl} = cube;

    let status = validateCubeName(name);

    if (status.error){
        return {
            error: status.error
        }
    }

    status = validateCubeDescription(description);

    if (status.error){
        return {
            error: status.error
        }
    }

    status = validateCubeImageUrl(imageUrl);

    if (status.error){
        return  {
            error: status.error
        }
    }

    return 'Cube is valid'
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
    validateCube,
    saveCubeInFile
};