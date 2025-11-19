#!/bin/bash

echo "🚀 Starting URL Monitoring System..."
echo ""

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating configuration directories..."
mkdir -p prometheus-config
mkdir -p data

# Create initial config files if they don't exist
if [ ! -f "prometheus-config/prometheus.yml" ]; then
    echo "📝 Creating initial Prometheus configuration..."
    cat > prometheus-config/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s
scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets:
          - localhost:9090
EOF
fi

if [ ! -f "prometheus-config/blackbox.yml" ]; then
    echo "📝 Creating initial Blackbox configuration..."
    cat > prometheus-config/blackbox.yml << 'EOF'
modules:
  http_2xx:
    prober: http
    timeout: 5s
    http:
      valid_http_versions:
        - HTTP/1.1
        - HTTP/2.0
      valid_status_codes:
        - 200
        - 201
        - 202
        - 203
        - 204
        - 205
        - 206
      method: GET
      preferred_ip_protocol: ip4
  tcp_connect:
    prober: tcp
    timeout: 5s
  icmp:
    prober: icmp
    timeout: 5s
EOF
fi

echo "🐳 Building and starting all containers..."
docker-compose up -d --build

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📊 Access your services:"
echo "   - Web Dashboard: http://localhost:3000  👈 Start here!"
echo "   - Prometheus:    http://localhost:9090"
echo "   - Blackbox:      http://localhost:9115"
echo "   - Grafana:       http://localhost:3001 (admin/admin)"
echo ""
echo "🎯 Next steps:"
echo "   1. Open http://localhost:3000"
echo "   2. Add URLs to monitor"
echo "   3. Restart Prometheus: docker-compose restart prometheus"
echo "   4. View metrics in Prometheus: http://localhost:9090"
echo ""
echo "💡 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop all:  docker-compose down"
echo "   - Restart:   docker-compose restart [service-name]"

