import { NextRequest, NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/notifications/push-server';

// ─── POST: Send a test push notification ─────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: messageBody, skillId } = body;

    await sendPushNotification({
      title: title || 'Skill Tree Reminder',
      body: messageBody || 'Time to practice!',
      icon: '/icons/icon-192x192.png',
      data: {
        skillId: skillId || null,
        url: '/',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] POST /api/push/send error:', err);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 },
    );
  }
}
