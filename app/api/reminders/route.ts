import { NextRequest, NextResponse } from 'next/server';
import { scheduleReminder, removeReminder, listReminders, startReminderWorker } from '@/lib/reminders/queue';

// Start the worker on first API hit (dev convenience)
let workerStarted = false;

function ensureWorker() {
  if (!workerStarted) {
    try {
      startReminderWorker();
      workerStarted = true;
    } catch (err) {
      console.error('[API] Failed to start reminder worker:', err);
    }
  }
}

// ─── GET: List all active reminders ──────────────────────────────────────────

export async function GET() {
  try {
    ensureWorker();
    const reminders = await listReminders();
    return NextResponse.json({ reminders });
  } catch (err) {
    console.error('[API] GET /api/reminders error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch reminders. Is Redis running?' },
      { status: 500 },
    );
  }
}

// ─── POST: Create or update a reminder ───────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    ensureWorker();
    const body = await request.json();
    const { skillId, skillName, frequency, preferredTime } = body;

    if (!skillId || !skillName || !frequency || !preferredTime) {
      return NextResponse.json(
        { error: 'Missing required fields: skillId, skillName, frequency, preferredTime' },
        { status: 400 },
      );
    }

    const jobId = await scheduleReminder({
      skillId,
      skillName,
      frequency,
      preferredTime,
    });

    return NextResponse.json({ success: true, jobId });
  } catch (err) {
    console.error('[API] POST /api/reminders error:', err);
    return NextResponse.json(
      { error: 'Failed to schedule reminder. Is Redis running?' },
      { status: 500 },
    );
  }
}

// ─── DELETE: Remove a reminder ───────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return NextResponse.json(
        { error: 'Missing skillId parameter' },
        { status: 400 },
      );
    }

    await removeReminder(skillId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] DELETE /api/reminders error:', err);
    return NextResponse.json(
      { error: 'Failed to remove reminder. Is Redis running?' },
      { status: 500 },
    );
  }
}
