#!/bin/bash
echo "Running post-start script"

cd /workspaces/tp-bases-2
nohup npm run start > app.log 2>&1 &
npm_pid=$!
# Check if the npm process is still running
if ! kill -0 $npm_pid 2>/dev/null; then
    echo "The application failed to start or has already exited."
    exit 1
fi


echo "Initializing..."
sleep 15

# Drop all MongoDB collections
echo "Dropping all MongoDB collections..."
mongosh 'expensesTracking_db' <<EOF
db.getCollectionNames().forEach(function(collection) {
    db[collection].drop();
});
EOF

echo "Flushing redis"
redis-cli -u redis://redis:6379 <<EOF
FLUSHDB
EOF

# Load data from CSVs
curl -X GET --location "http://localhost:3000/data/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json"


tail -f app.log