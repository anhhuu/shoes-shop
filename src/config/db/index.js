const mongoose = require('mongoose');
const debug = require('debug')('shoes-shop:db')

async function connect() {
    try {
        await mongoose.connect(
            'mongodb://127.0.0.1:27017/shoes-shop-dev-v1',
            //'mmongodb+srv://anhhuu:QntiC4albYUOsYHz@shoes-shop-cluster.cdqes.mongodb.net/shoes-shop-dev-v1?retryWrites=true&w=majority',
            //process.env.DB_URI, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
        debug('connected successfully!')
        console.log('connected successfully!')
    } catch (error) {
        debug('connected failure! <' + error + '>');
        console.log('connected failure! <' + error + '>');
    }
}

module.exports = { connect };