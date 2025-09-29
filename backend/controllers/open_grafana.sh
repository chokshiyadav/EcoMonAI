#!/bin/bash

# Set your Grafana URL, username, password, and dashboard UID
GRAFANA_URL="http://localhost:3000"
GRAFANA_USER="admin"
GRAFANA_PASS="Amma@0309"
DASHBOARD_UID="deak7v4wje48wf" # Replace with actual UID of your Grafana dashboard

# Install necessary tools if not already installed
if ! command -v xdg-open >/dev/null 2>&1; then
    sudo apt-get install -y xdg-utils
fi

# Logging into Grafana
login_response=$(curl -s -X POST "$GRAFANA_URL/login" \
-H "Content-Type: application/json" \
-d "{\"user\": \"$GRAFANA_USER\", \"password\": \"$GRAFANA_PASS\"}")

echo "Login Response: $login_response"

# Error handling for login request
if [[ $login_response == *"\"message\":\"Logged in\""* ]]; then
    echo "Logged into Grafana successfully."
else
    echo "Error: Unable to log into Grafana. Response: $login_response"
    exit 1
fi

# Automatically open the desired Grafana dashboard
echo "Opening Grafana dashboard..."
xdg-open "$GRAFANA_URL/d/$DASHBOARD_UID" || {
    echo "Error: Unable to open Grafana dashboard in browser."
    exit 1
}
