import { NextRequest, NextResponse } from 'next/server';
import { deleteURL, updateURL, getURLs } from '@/lib/storage';
import { generatePrometheusConfig } from '@/lib/prometheus';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteURL(params.id);
    if (!success) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    // Regenerate Prometheus config
    const urls = await getURLs();
    await generatePrometheusConfig(urls);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await updateURL(params.id, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    // Regenerate Prometheus config
    const urls = await getURLs();
    await generatePrometheusConfig(urls);

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 });
  }
}

