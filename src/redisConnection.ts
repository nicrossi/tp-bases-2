import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const redis = new Redis({
    host: redisHost,
    port: redisPort,
    lazyConnect: true,
});

redis.on('connect', () => {
    console.log(`Connected to Redis: ${redisHost}:${redisPort}`);
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

export async function connectToRedis() {
    try {
        await redis.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}

export default redis;