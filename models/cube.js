const uid = require('uniqid');
const fs = require('fs');

const cubeStoragePath = __dirname + '/..' + '/config/database.json';

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

        fs.writeFile(cubeStoragePath, JSON.stringify(data), (err) =>{
            if (err){
                throw err;
            }
        })
    }
}

module.exports = Cube;