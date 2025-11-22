#!/bin/bash
# Start backend server script

cd "$(dirname "$0")"

# Kill any existing backend process
pkill -f "python3 app.py" 2>/dev/null

# Wait a moment
sleep 1

# Start backend
echo "Starting FinLit backend server..."
python3 app.py > /tmp/finlit_backend.log 2>&1 &

# Get PID
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/finlit_backend.pid

# Wait for server to start
sleep 3

# Check if it's running
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID)"
    echo "📝 Logs: /tmp/finlit_backend.log"
    echo "🔍 Health check: curl http://localhost:5000/health"
else
    echo "❌ Backend failed to start. Check logs: /tmp/finlit_backend.log"
    exit 1
fi

