const fs = require('fs');

const cubeStoragePath = __dirname + '/..' + '/config/database.json';

const getAllCubes = () =>{
    const cubes = fs.readFileSync(cubeStoragePath, 'utf-8');
    return JSON.parse(cubes);
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

    return  cubes.filter(c => c.difficulty >= from);

};

const filterCubesByUpperBoundDifficulty = (cubes, to) => {

    if (!to){
        return cubes;
    }

    return  cubes.filter(c => c.difficulty <= to);

};

const filterCubesByCriteria = (cubes, search, from, to) =>{

    cubes = filterCubesByName(cubes, search);
    cubes = filterCubesByLowerBoundDifficulty(cubes, from);
    cubes = filterCubesByUpperBoundDifficulty(cubes, to);

    return cubes;
};

const getCubeById = (id) =>{
    return getAllCubes().filter(c => c.id === id)[0];
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
    saveCubeInFile
};