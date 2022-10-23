const redis = require("redis");

let redisClient;

(async () => {
    var cacheHostName = process.env.REDIS_HOST_NAME;
    var cachePassword = process.env.REDIS_KEY;
    redisClient = redis.createClient({
        url: "rediss://" + cacheHostName + ":6380",
        password: cachePassword,
    });
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
})();

module.exports = redisClient;
