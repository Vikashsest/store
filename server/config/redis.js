import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: "redis", // 👈 docker-compose service name
    port: 6379,
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
  process.exit(1);
});

await redisClient.connect();

export default redisClient;
