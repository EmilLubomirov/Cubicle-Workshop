const uid = require('uniqid');
const {saveCubeInFile} = require('../services/cubes');

class Cube{

    constructor(name, description, imageUrl, difficulty) {
        this.id = uid();
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.difficulty = difficulty;
    }

    save(){

        const data = {
            id: this.id,
            name: this.name,
            description: this.description,
            imageUrl: this.imageUrl,
            difficulty: this.difficulty
        };

        saveCubeInFile(data);
    }
}

module.exports = Cube;