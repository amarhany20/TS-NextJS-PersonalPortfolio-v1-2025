#!/bin/bash

# This script creates a new user in the database
# Usage: ./create-user.sh email password [firstName] [lastName] [role]

# Check if required arguments are provided
if [ $# -lt 2 ]; then
  echo "Usage: ./create-user.sh <email> <password> [firstName] [lastName] [role]"
  exit 1
fi

EMAIL=$1
PASSWORD=$2
FIRST_NAME=${3:-""}
LAST_NAME=${4:-""}
ROLE=${5:-"USER"}

# Validate role
if [ "$ROLE" != "USER" ] && [ "$ROLE" != "ADMIN" ] && [ "$ROLE" != "SUPER_ADMIN" ]; then
  echo "Error: Role must be one of USER, ADMIN, or SUPER_ADMIN"
  exit 1
fi

# Run the script with Node
npx tsx scripts/create-user-simple.ts "$EMAIL" "$PASSWORD" "$FIRST_NAME" "$LAST_NAME" "$ROLE"
