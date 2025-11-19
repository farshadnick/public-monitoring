import { NextRequest, NextResponse } from 'next/server';

// This endpoint receives pings from cron jobs and scheduled tasks
export async function GET(
  request: NextRequest,
  { params }: { params: { checkId: string } }
) {
  return handlePing(request, params.checkId);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { checkId: string } }
) {
  return handlePing(request, params.checkId);
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: { checkId: string } }
) {
  return handlePing(request, params.checkId);
}

async function handlePing(request: NextRequest, checkId: string) {
  try {
    const startTime = Date.now();
    
    // Get client information
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const remoteAddr = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
    
    // Get request body if present
    let body: string | undefined;
    try {
      if (request.method === 'POST') {
        body = await request.text();
      }
    } catch (error) {
      // Body might not be parseable, that's okay
    }

    const duration = Date.now() - startTime;

    // In a real implementation, you would:
    // 1. Look up the check by checkId in database
    // 2. Validate the check exists and is active
    // 3. Record the ping event in database
    // 4. Update check's lastPing timestamp
    // 5. Calculate if check should transition to "up" state
    // 6. Send notifications if state changed

    // For now, return success
    console.log(`Ping received for check ${checkId}:`, {
      timestamp: new Date().toISOString(),
      method: request.method,
      userAgent,
      remoteAddr,
      duration,
      bodyLength: body?.length || 0,
    });

    // Record the ping event (mock implementation)
    const pingEvent = {
      id: Math.random().toString(36).substr(2, 9),
      checkId,
      timestamp: new Date().toISOString(),
      duration,
      userAgent,
      remoteAddr,
      method: request.method,
      body: body?.substring(0, 1000), // Store first 1000 chars
      success: true,
    };

    // In production, save to database:
    // await savePingEvent(pingEvent);
    // await updateCheckStatus(checkId, 'up', new Date().toISOString());

    return NextResponse.json(
      {
        success: true,
        message: 'Ping received successfully',
        checkId,
        timestamp: new Date().toISOString(),
      },
      { 
        status: 200,
        headers: {
          'X-Ping-Id': pingEvent.id,
          'X-Ping-Time': pingEvent.timestamp,
        }
      }
    );
  } catch (error) {
    console.error('Error handling ping:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optional: Add a route to handle /start and /fail variants
export async function PUT(
  request: NextRequest,
  { params }: { params: { checkId: string } }
) {
  // Handle /start - mark job as started
  // Handle /fail - mark job as failed
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // 'start' or 'fail'

  console.log(`Ping action ${action} for check ${params.checkId}`);

  return NextResponse.json({
    success: true,
    action,
    checkId: params.checkId,
    timestamp: new Date().toISOString(),
  });
}

