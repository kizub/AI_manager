import { Queue } from 'bullmq';

export const deliveryQueue = process.env.REDIS_URL
  ? new Queue('deliveryQueue', {
      connection: { url: process.env.REDIS_URL }
    })
  : null;
