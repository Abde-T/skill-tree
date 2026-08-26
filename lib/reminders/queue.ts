import { Queue, Worker, type Job } from 'bullmq';
import { getRedis } from '@/lib/redis/connection';
import { sendPushNotification } from '@/lib/notifications/push-server';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReminderJobData {
  skillId: string;
  skillName: string;
  frequency: string;      // 'daily', '2x/week', '3x/week', 'weekly'
  preferredTime: string;  // 'HH:mm'
}

export interface ReminderMetadata {
  skillId: string;
  skillName: string;
  frequency: string;
  preferredTime: string;
}

// ─── Metadata Storage (Redis) ────────────────────────────────────────────────

const REMINDERS_METADATA_KEY = 'reminders:metadata';

async function saveReminderMetadata(data: ReminderJobData): Promise<void> {
  const redis = getRedis();
  const metadata: ReminderMetadata = {
    skillId: data.skillId,
    skillName: data.skillName,
    frequency: data.frequency,
    preferredTime: data.preferredTime,
  };
  await redis.hset(REMINDERS_METADATA_KEY, data.skillId, JSON.stringify(metadata));
  console.log(`[Reminder] Saved metadata for skill: ${data.skillId}`);
}

async function removeReminderMetadata(skillId: string): Promise<void> {
  const redis = getRedis();
  await redis.hdel(REMINDERS_METADATA_KEY, skillId);
  console.log(`[Reminder] Removed metadata for skill: ${skillId}`);
}

async function getAllReminderMetadata(): Promise<ReminderMetadata[]> {
  const redis = getRedis();
  const all = await redis.hgetall(REMINDERS_METADATA_KEY);
  return Object.values(all).map((s) => JSON.parse(s));
}

// ─── Queue ───────────────────────────────────────────────────────────────────

const QUEUE_NAME = 'reminder-queue';

let reminderQueue: Queue<ReminderJobData> | null = null;

export function getReminderQueue(): Queue<ReminderJobData> {
  if (!reminderQueue) {
    reminderQueue = new Queue<ReminderJobData>(QUEUE_NAME, {
      connection: getRedis(),
      defaultJobOptions: {
        removeOnComplete: { count: 50 },
        removeOnFail: { count: 20 },
      },
    });
  }
  return reminderQueue;
}

// ─── Cron Helpers ────────────────────────────────────────────────────────────

/**
 * Convert a human-readable frequency + preferred time to a cron expression.
 * e.g. frequency='daily', time='18:00' -> '0 18 * * *'
 * e.g. frequency='3x/week', time='09:30' -> '30 9 * * 1,3,5'
 */
function toCron(frequency: string, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);

  switch (frequency) {
    case 'daily':
      return `${minutes} ${hours} * * *`;
    case '3x/week':
      return `${minutes} ${hours} * * 1,3,5`; // Mon, Wed, Fri
    case '2x/week':
      return `${minutes} ${hours} * * 2,5`; // Tue, Fri
    case 'weekly':
      return `${minutes} ${hours} * * 1`; // Monday
    default:
      return `${minutes} ${hours} * * *`; // Default to daily
  }
}

// ─── Schedule / Remove Reminders ─────────────────────────────────────────────

/**
 * BullMQ v6 uses `upsertJobScheduler` for repeatable/cron jobs instead of
 * the old `repeat` option on `queue.add()`.
 */
export async function scheduleReminder(data: ReminderJobData): Promise<string> {
  const queue = getReminderQueue();
  const schedulerId = `reminder-${data.skillId}`;
  const cron = toCron(data.frequency, data.preferredTime);

  // Remove existing scheduler for this skill first
  await removeReminder(data.skillId);

  // BullMQ v6: use upsertJobScheduler for cron-based repeating jobs
  await queue.upsertJobScheduler(
    schedulerId,
    { pattern: cron },
    { name: schedulerId, data },
  );

  // Save metadata
  await saveReminderMetadata(data);

  console.log(`[Reminder] Scheduled "${data.skillName}" with cron: ${cron}`);
  return schedulerId;
}

export async function removeReminder(skillId: string): Promise<void> {
  const queue = getReminderQueue();
  const schedulerId = `reminder-${skillId}`;

  try {
    await queue.removeJobScheduler(schedulerId);
    console.log(`[Reminder] Removed scheduler for skill: ${skillId}`);
  } catch {
    // Scheduler might not exist yet, that's fine
  }

  // Remove metadata
  await removeReminderMetadata(skillId);
}

export async function listReminders(): Promise<ReminderMetadata[]> {
  return getAllReminderMetadata();
}

// ─── Worker ──────────────────────────────────────────────────────────────────

let reminderWorker: Worker<ReminderJobData> | null = null;

export function startReminderWorker(): Worker<ReminderJobData> {
  if (reminderWorker) return reminderWorker;

  reminderWorker = new Worker<ReminderJobData>(
    QUEUE_NAME,
    async (job: Job<ReminderJobData>) => {
      console.log(`[Worker] Reminder fired for skill: ${job.data.skillName}`);

      // Send push notification to all subscribed clients
      await sendPushNotification({
        title: 'Skill Tree Reminder',
        body: `Time to practice ${job.data.skillName}!`,
        icon: '/icons/icon-192x192.png',
        data: {
          skillId: job.data.skillId,
          url: '/',
        },
      });
    },
    {
      connection: getRedis(),
      concurrency: 5,
    },
  );

  reminderWorker.on('completed', (job) => {
    console.log(`[Worker] Job completed: ${job.id}`);
  });

  reminderWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job failed: ${job?.id}`, err.message);
  });

  console.log('[Worker] Reminder worker started');
  return reminderWorker;
}
