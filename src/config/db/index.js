const mongoose = require('mongoose');
const debug = require('debug')('shoes-shop:db')

async function connect() {
    try {
        await mongoose.connect(
            process.env.DB_URI_V2, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
        debug('connected successfully!')
    } catch (error) {
        debug('connected failure! <' + error + '>');
    }
}

module.exports = { connect };