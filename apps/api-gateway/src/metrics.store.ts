type MetricsBucket = {
  count: number;
  totalLatencyMs: number;
};

type MetricState = {
  totalRequests: number;
  statusCounts: Record<string, number>;
  serviceCounts: Record<string, number>;
  serviceLatency: Record<string, MetricsBucket>;
};

const state: MetricState = {
  totalRequests: 0,
  statusCounts: {},
  serviceCounts: {},
  serviceLatency: {}
};

export function recordRequest(
  service: string,
  statusCode: number,
  latencyMs: number
) {
  state.totalRequests += 1;
  const statusKey = String(statusCode);
  state.statusCounts[statusKey] = (state.statusCounts[statusKey] ?? 0) + 1;
  state.serviceCounts[service] = (state.serviceCounts[service] ?? 0) + 1;

  const bucket = state.serviceLatency[service] ?? {
    count: 0,
    totalLatencyMs: 0
  };
  bucket.count += 1;
  bucket.totalLatencyMs += latencyMs;
  state.serviceLatency[service] = bucket;
}

export function getMetricsSnapshot() {
  const serviceLatency: Record<string, { avgMs: number; count: number }> = {};
  Object.entries(state.serviceLatency).forEach(([service, bucket]) => {
    serviceLatency[service] = {
      avgMs: bucket.count ? Math.round(bucket.totalLatencyMs / bucket.count) : 0,
      count: bucket.count
    };
  });

  return {
    totalRequests: state.totalRequests,
    statusCounts: state.statusCounts,
    serviceCounts: state.serviceCounts,
    serviceLatency
  };
}
