const Accessory = require('../models/accessory');

const getAccessories = async () =>{
    return await Accessory.find();
};

const getAvailableAccessories = async (cubeAccessories, cubeId) =>{

    // const mappedCubeAccessories = cubeAccessories.map(ca => {
    //     return ca.valueOf().toString()
    // });
    //
    // const allAccessories = await getAccessories();
    //
    // return allAccessories.filter(a => {
    //     return !mappedCubeAccessories.includes(a._id.valueOf().toString());
    // });

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