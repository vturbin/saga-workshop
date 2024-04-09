#!/bin/bash

# Wait for MongoDB server to be fully up and running
sleep 10

# Run MongoDB replica set initiation and capture the output
output=$(mongosh --host mongo:27017 -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase "admin" --eval 'rs.initiate({_id: "rs0", members: [{_id: 0, host: "mongo:27017"}]});' 2>&1)

# Check if the error is due to the replica set already being initialized
if echo "$output" | grep -q 'already initialized'; then
    echo "Replica set is already initialized. This is not an error."
    exit 0
fi

# Check for connection failure or other errors
if [[ "$output" == *"Error"* ]]; then
    echo "$output"
    echo "Error: Failed to execute the command."
    exit 1
fi

# Parse the output for success or specific errors
if [[ "$output" == *'{ ok: 1 }'* ]]; then
    echo "$output"
    echo "Replica set initiated successfully."
    exit 0
elif echo "$output" | grep -q '{ ok: 0 }'; then
    echo "Failed to initiate replica set."
    exit 1
else
    echo "Unexpected output received:"
    echo "$output"
    exit 1
fi
