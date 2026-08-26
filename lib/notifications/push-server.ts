import webPush from 'web-push';
import { getRedis } from '@/lib/redis/connection';

// ─── Configure VAPID ─────────────────────────────────────────────────────────

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@skilltree.local';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// ─── Subscription Storage (Redis) ───────────────────────────────────────────

const SUBSCRIPTIONS_KEY = 'push:subscriptions';

export async function saveSubscription(subscription: webPush.PushSubscription): Promise<void> {
  const redis = getRedis();
  const id = Buffer.from(subscription.endpoint).toString('base64').slice(0, 64);
  await redis.hset(SUBSCRIPTIONS_KEY, id, JSON.stringify(subscription));
  console.log('[Push] Subscription saved');
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const redis = getRedis();
  const id = Buffer.from(endpoint).toString('base64').slice(0, 64);
  await redis.hdel(SUBSCRIPTIONS_KEY, id);
}

export async function getAllSubscriptions(): Promise<webPush.PushSubscription[]> {
  const redis = getRedis();
  const all = await redis.hgetall(SUBSCRIPTIONS_KEY);
  console.log(`[Push] Retrieved ${Object.keys(all).length} subscriptions from Redis`);
  return Object.values(all).map((s) => JSON.parse(s));
}

// ─── Send Notification ───────────────────────────────────────────────────────

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

export async function sendPushNotification(payload: PushPayload): Promise<void> {
  const subscriptions = await getAllSubscriptions();

  if (subscriptions.length === 0) {
    console.log('[Push] No subscriptions to notify');
    return;
  }

  const jsonPayload = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webPush.sendNotification(sub, jsonPayload);
      } catch (err: unknown) {
        const error = err as { statusCode?: number };
        // If subscription is expired/invalid, remove it
        if (error.statusCode === 404 || error.statusCode === 410) {
          console.log('[Push] Removing expired subscription');
          await removeSubscription(sub.endpoint);
        } else {
          throw err;
        }
      }
    }),
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  console.log(`[Push] Sent to ${successful} clients, ${failed} failures`);
}
