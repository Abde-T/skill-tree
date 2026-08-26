import { NextRequest, NextResponse } from 'next/server';
import { saveSubscription, removeSubscription } from '@/lib/notifications/push-server';

// ─── POST: Save a push subscription ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { error: 'Invalid push subscription: missing endpoint' },
        { status: 400 },
      );
    }

    await saveSubscription(subscription);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] POST /api/push/subscribe error:', err);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 },
    );
  }
}

// ─── DELETE: Remove a push subscription ──────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint' },
        { status: 400 },
      );
    }

    await removeSubscription(endpoint);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API] DELETE /api/push/subscribe error:', err);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 },
    );
  }
}
