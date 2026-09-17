var redis = require("redis");
const configure = require('./configure')

const config = configure()
const db = process.env.REDIS_URL
  ? redis.createClient({
      url: process.env.REDIS_URL
    })
  : redis.createClient({
      url: `redis://${config.redis.host}:${config.redis.port}`
    });

db.on("error", (err) => {
  console.error("Redis error :", err);
    process.exit(1);
});

if (typeof db.connect === 'function') {
  db.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  });
}

process.on('SIGINT', function () {
  db.quit(() => {
      console.log("\nRedis disconnected. Server stopped.");
      process.exit(0);
    });
});

module.exports = db
