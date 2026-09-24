import React, { useState, useEffect } from 'react';
import { Activity, X, RefreshCw, CheckCircle2, AlertTriangle, Server, Globe, Cpu, ExternalLink } from 'lucide-react';
import { HealthCheckResponse } from '../../api/health';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok && res.status !== 503) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data: HealthCheckResponse = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to fetch API health status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">API & Service Health Check</h3>
              <p className="text-xs text-slate-500">Live endpoint: <code>/api/health</code></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHealth}
              disabled={isLoading}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh Health Status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading && !healthData ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
            <span>Pinging server and SLA OneMap APIs...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Health Check Query Failed</span>
            </div>
            <p>{error}</p>
            <button
              onClick={fetchHealth}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs font-semibold cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : healthData ? (
          <div className="space-y-4">
            {/* Overall Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              healthData.status === 'ok'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2.5">
                {healthData.status === 'ok' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {healthData.status === 'ok' ? 'All Systems Operational' : 'Degraded Performance'}
                  </div>
                  <div className="text-[11px] opacity-80">
                    Uptime: {Math.floor(healthData.uptimeSeconds / 60)}m {healthData.uptimeSeconds % 60}s · Checked at {new Date(healthData.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <a
                href="/api/health"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Raw JSON</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Subsystem Health Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Application Server */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-600" />
                    <span>Express Server</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 font-mono">
                  <div>Port: {healthData.services.application.port}</div>
                  <div>Env: {healthData.services.application.env}</div>
                  <div>Node: {healthData.nodeVersion}</div>
                </div>
              </div>

              {/* SLA OneMap API */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-rose-600" />
                    <span>SLA OneMap API</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    healthData.services.oneMapApi.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 font-mono">
                  <div>Latency: {healthData.services.oneMapApi.latencyMs} ms</div>
                  <div>Status: {healthData.services.oneMapApi.status}</div>
                  <div className="line-clamp-1 font-sans text-slate-500 text-[10px]">
                    {healthData.services.oneMapApi.details}
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Statistics */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Cpu className="w-3.5 h-3.5 text-slate-600" />
                <span>Runtime Memory Usage</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500">RSS</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {healthData.memory.rssMb} MB
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500">Heap Used</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {healthData.memory.heapUsedMb} MB
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-[10px] text-slate-500">Heap Total</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {healthData.memory.heapTotalMb} MB
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Ping Test */}
            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Lightweight endpoint also available at <code>/api/ping</code></span>
              <span className="text-emerald-700 font-medium">HTTP 200 OK</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
