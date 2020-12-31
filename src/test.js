const productMongooseModel = require('./app/models/mongooseModels/productMongooseModel');

test = async() => {

    let a = ' '
    let product = await productMongooseModel.find({
        $and: [
            //{ $text: { $search: ' ' } },
            {
                name: /a/
            },
            {
                $and: [{
                        'price.price_value': {
                            $gt: 5000000
                        }
                    },
                    {
                        'price.price_value': {
                            $lt: 100000000
                        }
                    }
                ]
            }
        ]
    }).limit(3);
    console.log(product);
    console.log(product.length);
}

const db = require('./config/db');

(async() => {
    await db.connect();
    await test();
})()