import { createClient } from "redis";

// const redisClient = await createClient().connect();
const redisClient = createClient({
  socket: {
    host: "red-d4fdnk4hg0os738u5jn0.onrender.com",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

await redisClient.connect();
export default redisClient;
