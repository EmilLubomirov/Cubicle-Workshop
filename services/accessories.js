const Accessory = require('../models/accessory');

const getAccessories = async () =>{
    return await Accessory.find();
};

const getAvailableAccessories = async (cubeAccessories) =>{

    const mappedCubeAccessories = cubeAccessories.map(ca => {
        return ca.valueOf().toString()
    });

    const allAccessories = await getAccessories();

    return allAccessories.filter(a => {
        return !mappedCubeAccessories.includes(a._id.valueOf().toString());
    });
};

module.exports = {
    getAccessories,
    getAvailableAccessories
};