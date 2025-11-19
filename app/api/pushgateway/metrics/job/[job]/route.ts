import { NextRequest, NextResponse } from 'next/server';

// This endpoint receives metrics push from batch jobs
// Compatible with standard metrics format
export async function POST(
  request: NextRequest,
  { params }: { params: { job: string } }
) {
  return handleMetricsPush(request, params.job);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { job: string } }
) {
  return handleMetricsPush(request, params.job);
}

async function handleMetricsPush(request: NextRequest, job: string) {
  try {
    const { searchParams } = new URL(request.url);
    const instance = searchParams.get('instance') || 'default';
    
    // Get metrics data from request body
    const metricsText = await request.text();
    
    // Parse standard metrics text format (simplified parser)
    const metrics: any[] = [];
    const lines = metricsText.split('\n');
    
    let currentMetric: any = {};
    for (const line of lines) {
      if (line.startsWith('#')) {
        // Parse metadata
        if (line.startsWith('# HELP ')) {
          currentMetric.help = line.replace('# HELP ', '').trim();
        } else if (line.startsWith('# TYPE ')) {
          const parts = line.replace('# TYPE ', '').trim().split(' ');
          currentMetric.type = parts[1];
        }
      } else if (line.trim()) {
        // Parse metric line
        const match = line.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*(?:{[^}]*})?)?\s+([0-9.eE+-]+)(?:\s+([0-9]+))?/);
        if (match) {
          const [, nameWithLabels, value, timestamp] = match;
          
          // Extract metric name and labels
          const labelMatch = nameWithLabels?.match(/^([^{]+)(?:{([^}]*)})?/);
          if (labelMatch) {
            const [, metricName, labelsStr] = labelMatch;
            
            const labels: Record<string, string> = {};
            if (labelsStr) {
              const labelPairs = labelsStr.split(',');
              for (const pair of labelPairs) {
                const [key, val] = pair.split('=');
                labels[key.trim()] = val.trim().replace(/^"|"$/g, '');
              }
            }
            
            metrics.push({
              id: Math.random().toString(36).substr(2, 9),
              job,
              instance,
              metric_name: metricName,
              value: parseFloat(value),
              labels,
              timestamp: timestamp ? new Date(parseInt(timestamp) * 1000).toISOString() : new Date().toISOString(),
              help: currentMetric.help,
              type: currentMetric.type,
            });
            
            currentMetric = {};
          }
        }
      }
    }

    // In production, save metrics to database
    // await saveMetrics(job, instance, metrics);
    
    console.log(`Received ${metrics.length} metrics for job ${job}, instance ${instance}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Metrics pushed successfully',
        job,
        instance,
        metrics_count: metrics.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling metrics push:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to push metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE to remove metrics for a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { job: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const instance = searchParams.get('instance');

    // In production, delete metrics from database
    // await deleteMetrics(params.job, instance);

    return NextResponse.json({
      success: true,
      message: `Deleted metrics for job ${params.job}${instance ? `, instance ${instance}` : ''}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

