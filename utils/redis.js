var redis = require('redis');

let client = redis.createClient({
    host: process.env.REDIS_HOST||"127.0.0.1",
    port: process.env.REDIS_PORT||6379,
    password: process.env.REDIS_PASSWORD||admin
})

module.exports=client;