import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | undefined;

export const createRedis = async () => {
  client?.on('error', (err) => console.log('Redis Client Error', err));

  if (client && client.isOpen) {
    return client;
  }

  client = createClient({
    url: process.env.REDIS_SERVER,
  });

  await client.connect();

  return client;
};
