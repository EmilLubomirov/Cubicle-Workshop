const fs = require('fs');

const cubeStoragePath = __dirname + '/..' + '/config/database.json';

const getAllCubes = () =>{
    const cubes = fs.readFileSync(cubeStoragePath, 'utf-8');
    return JSON.parse(cubes);
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
    getCubeById,
    saveCubeInFile
};