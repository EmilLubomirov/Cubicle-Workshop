const Accessory = require('../models/accessory');

const getAccessories = async () =>{
    return await Accessory.find();
};

const getAvailableAccessories = async (cubeAccessories, cubeId) =>{

    const allAccessories = await getAccessories();
    const cubeIdStr = cubeId.valueOf().toString();

    return allAccessories.filter(acc => {
        return !JSON.stringify(acc.cubes).includes(cubeIdStr);
        });
};

module.exports = {
    getAccessories,
    getAvailableAccessories
};