const redis = require('redis');
const {promisify} = require('util');
// const client = redis.createClient();

const client = redis.createClient({
    host: 'redis-14615.c8.us-east-1-2.ec2.cloud.redislabs.com',
    port: 14615,
    password: process.env.PASSWORD_REDIS
})
const getAsync = promisify(client.get).bind(client);
module.exports = getAsync;
module.exports.client = client;