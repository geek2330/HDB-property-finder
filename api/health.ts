import type { Request, Response } from 'express';

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unreachable';
  latencyMs: number;
  details?: string;
  checkedAt: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  nodeVersion: string;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  services: {
    oneMapApi: ServiceHealth;
    application: {
      status: 'healthy';
      port: number;
      env: string;
    };
  };
}

const startTime = Date.now();

/**
 * Pings SLA OneMap to verify outbound network connectivity and response latency
 */
async function checkOneMapHealth(): Promise<ServiceHealth> {
  const start = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const apiKey = process.env.VITE_ONEMAP_API_KEY || '';
    const headers: Record<string, string> = {
      'User-Agent': 'HDB-Nest-HealthCheck/1.0',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Ping OneMap public endpoint with a lightweight query
    const res = await fetch(
      'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=singapore&returnGeom=N&getAddrDetails=N&pageNum=1',
      {
        signal: controller.signal,
        headers,
      }
    );
    clearTimeout(timeoutId);

    const latencyMs = Date.now() - start;

    if (res.ok) {
      return {
        status: 'healthy',
        latencyMs,
        details: `SLA OneMap API operational (${apiKey ? 'Authenticated' : 'Public basemap mode'})`,
        checkedAt,
      };
    } else {
      return {
        status: 'degraded',
        latencyMs,
        details: `OneMap responded with HTTP status ${res.status}`,
        checkedAt,
      };
    }
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    return {
      status: 'degraded',
      latencyMs,
      details: err?.name === 'AbortError' ? 'OneMap request timed out after 4s' : err?.message || 'Connection failed',
      checkedAt,
    };
  }
}

/**
 * Handler for GET /api/health
 */
export async function healthCheckHandler(_req: Request, res: Response): Promise<void> {
  const mem = process.memoryUsage();
  const oneMapHealth = await checkOneMapHealth();

  const isDegraded = oneMapHealth.status === 'unreachable';
  const overallStatus = isDegraded ? 'degraded' : 'ok';
  const httpStatus = overallStatus === 'ok' ? 200 : 503;

  const responsePayload: HealthCheckResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    nodeVersion: process.version,
    memory: {
      rssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      heapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      heapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
    },
    services: {
      oneMapApi: oneMapHealth,
      application: {
        status: 'healthy',
        port: Number(process.env.PORT || 3000),
        env: process.env.NODE_ENV || 'development',
      },
    },
  };

  res.status(httpStatus).json(responsePayload);
}

/**
 * Handler for GET /api/ping (quick lightweight endpoint)
 */
export function pingHandler(_req: Request, res: Response): void {
  res.json({
    status: 'pong',
    timestamp: new Date().toISOString(),
  });
}
