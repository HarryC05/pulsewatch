const formatPage = (page) => {
  return {
    title: page.title,
    description: page.description,
    monitors: page.monitors.map((monitor) => ({
      id: monitor.id,
      name: monitor.name,
      url: monitor.url,
      lastChecked: monitor.monitor.heartbeats[0]?.createdAt || null,
      responseTime: monitor.monitor.heartbeats[0]?.responseTime || null,
      status: monitor.monitor.heartbeats[0]?.status || 'unknown',
      heartbeats: monitor.monitor.heartbeats.map((heartbeat) => ({
        id: heartbeat.id,
        status: heartbeat.status,
        responseTime: heartbeat.responseTime,
        createdAt: heartbeat.createdAt,
      })),
    })),
  }
}

export default formatPage;
