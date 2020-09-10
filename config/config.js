module.exports = {
    development: {
        port: process.env.PORT || 3000,
        databaseURL: process.env.DATABASE_URL,
        secretPhrase: process.env.SECRET_PHRASE
    },
    production: {}
};