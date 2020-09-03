module.exports = {
    development: {
        port: process.env.PORT || 3000,
        connectionStr: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.miqbp.mongodb.net/softuni?retryWrites=true&w=majority`
    },
    production: {}
};