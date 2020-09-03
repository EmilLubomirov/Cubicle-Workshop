module.exports = {
    development: {
        port: process.env.PORT || 3000,
        databaseURL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.miqbp.mongodb.net/softuni?retryWrites=true&w=majority`
    },
    production: {}
};