import { NextRequest, NextResponse } from 'next/server';
import { getReminderQueue } from '@/lib/reminders/queue';
import { getRedis } from '@/lib/redis/connection';

export async function GET() {
  try {
    const redis = getRedis();
    
    // Get memory usage from Redis INFO
    const info = await redis.info('memory');
    const memoryLines = info.split('\n');
    
    let usedMemory = 0;
    let maxMemory = 0;
    let usedMemoryRss = 0;
    
    memoryLines.forEach((line) => {
      if (line.startsWith('used_memory:')) {
        usedMemory = parseInt(line.split(':')[1], 10);
      } else if (line.startsWith('maxmemory:')) {
        maxMemory = parseInt(line.split(':')[1], 10);
      } else if (line.startsWith('used_memory_rss:')) {
        usedMemoryRss = parseInt(line.split(':')[1], 10);
      }
    });
    
    // Convert to MB for display
    const usedMemoryMB = (usedMemory / 1024 / 1024).toFixed(2);
    const maxMemoryMB = maxMemory > 0 ? (maxMemory / 1024 / 1024).toFixed(2) : 'Unlimited';
    const usedMemoryRssMB = (usedMemoryRss / 1024 / 1024).toFixed(2);
    const freeMemoryMB = maxMemory > 0 ? ((maxMemory - usedMemory) / 1024 / 1024).toFixed(2) : 'N/A';
    
    // Get all scheduled reminders
    const queue = getReminderQueue();
    const schedulers = await queue.getJobSchedulers();
    
    const schedules = schedulers.map((scheduler) => ({
      id: scheduler.id,
      pattern: scheduler.pattern,
      name: scheduler.name,
    }));
    
    // Get reminder metadata
    const metadata = await redis.hgetall('reminders:metadata');
    const reminders = Object.entries(metadata).map(([skillId, data]) => ({
      skillId,
      ...JSON.parse(data),
    }));
    
    // Get total key count (all keys in Redis)
    const dbSize = await redis.dbsize();
    
    // Get all keys with their types
    const allKeys = await redis.keys('*');
    const keyTypes = await Promise.all(
      allKeys.map(async (key) => ({
        key,
        type: await redis.type(key),
      }))
    );
    
    return NextResponse.json({
      memory: {
        used: usedMemoryMB,
        max: maxMemoryMB,
        usedRss: usedMemoryRssMB,
        free: freeMemoryMB,
        usedBytes: usedMemory,
        maxBytes: maxMemory,
      },
      schedules,
      reminders,
      db: {
        totalKeys: dbSize,
        keys: keyTypes,
      },
    });
  } catch (err) {
    console.error('[API] GET /api/redis-data error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch Redis data. Is Redis running?' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 },
      );
    }

    const redis = getRedis();
    await redis.del(key);

    console.log(`[API] Deleted Redis key: ${key}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] DELETE /api/redis-data error:', err);
    return NextResponse.json(
      { error: 'Failed to delete key' },
      { status: 500 },
    );
  }
}
