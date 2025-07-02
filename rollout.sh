#!/usr/bin/env bash

# Script to copy all necessary files to the server (= rollout of the software)

# Everything will be copied except the folders "data, ""built" and "node_modules" and the file "error.log"

if [ $# -ne 2 ]; then
  script_name=$(basename "$0")
  echo "Usage: $script_name <server_name> <destination_folder>"
  echo "Example: $script_name pi500 /home/thees/bin/shopping-list-app"
  exit 1
fi

SERVER_NAME=$1
DESTINATION=$2

rsync \
  --stats \
  --archive \
  --verbose \
  --exclude='data' \
  --exclude='built' \
  --exclude='node_modules' \
  --exclude='error.log' \
  . \
  "$USER@$SERVER_NAME:$DESTINATION" \
   && echo -e "\nFiles have been copied to $SERVER_NAME:$DESTINATION"



# 0. BEFORE the execution of this script stop the app on the server !!!
# 1. then execute this script
# 2. then go to the directory where the app is located on the server and execute: npm install
# 3. After that you can restart the app on the server
# 
#
# If you use systemd to start the app please make sure that the setup.sh script is executed before the app starts.
#
# Example /etc/systemd/system/shopping_list_app.service that takes care of the setup.sh script:
# 
#
#
# [Unit]
# Description=Shopping List App
# After=network.target
# 
# [Service]
# Type=simple
# User=thees
# WorkingDirectory=/home/thees/bin/shopping-list-app
# ExecStartPre=/usr/bin/npx tsc --project /home/thees/bin/shopping-list-app/tsconfig.json
# ExecStartPre=/home/thees/bin/shopping-list-app/src/routes/shopping_list/setup.sh
# ExecStart=/usr/bin/node /home/thees/bin/shopping-list-app/built/start.js
# Restart=always
# RestartSec=10
# 
# [Install]
# WantedBy=multi-user.target
# 

