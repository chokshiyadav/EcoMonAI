#!/bin/bash

# Import common functions
source /home/charansrisai/bookmyevent/backend/controllers/common_functions.sh

INFLUXDB_MEASUREMENT_LOGS="aggregated_logs3"
LOG_FILE="/home/charansrisai/bookmyevent/backend/logs/server.log"

# Temporary file to store aggregated data
temp_file="message_counts.tmp"
> "$temp_file"

# Process log file
while IFS= read -r line; do
    # Extract fields using jq
    message=$(echo "$line" | jq -r '.message')
    timestamp=$(echo "$line" | jq -r '.timestamp')

    # Convert timestamp to nanoseconds for InfluxDB
    timestamp_ns=$(date -d "$timestamp" +"%s%N")

    # Format message to be InfluxDB tag-safe (replace spaces with underscores)
    safe_message=$(echo "$message" | tr ' ' '_')

    # Update count in temporary file
    if grep -q "$safe_message" "$temp_file"; then
        # Increment count & update latest timestamp
        awk -v msg="$safe_message" -v ts="$timestamp_ns" 'BEGIN {FS=OFS=","} 
        $1 == msg { $2 += 1; if ($3 < ts) $3 = ts }1' "$temp_file" > temp.tmp && mv temp.tmp "$temp_file"
    else
        # Add new message entry
        echo "$safe_message,1,$timestamp_ns" >> "$temp_file"
    fi
done < "$LOG_FILE"

# Send aggregated data to InfluxDB
while IFS=, read -r message count last_timestamp; do
    # Format tags and fields correctly for InfluxDB
    tags="message=$message"  # No quotes, spaces replaced with underscores
    fields="count=$count"

    echo "Pushing log: tags=[$tags], fields=[$fields], last_timestamp: $last_timestamp"

    # Use push_to_influxdb function
    push_to_influxdb "$INFLUXDB_MEASUREMENT_LOGS,message=$message" "$fields" "$last_timestamp"
done < "$temp_file"

# Cleanup temp file
rm "$temp_file"
