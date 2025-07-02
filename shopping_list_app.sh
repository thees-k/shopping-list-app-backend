#!/usr/bin/env bash


script_name=$(basename "$0")
action="${1,,}"
[ "$action" != "start" ] && [ "$action" != "restart" ] && [ "$action" != "stop" ] && [ "$action" != "status" ] && { echo "Usage: $script_name start|restart|stop|status"; exit 1; }


if [ "$action" = "start" ] || [ "$action" = "restart" ] ; then
    sudo systemctl restart shopping_list_app.service
    sleep 3
elif [ "$action" = "stop" ]; then
    sudo systemctl stop shopping_list_app.service
    sleep 3
fi

sudo systemctl status shopping_list_app.service



# Example /etc/systemd/system/shopping_list_app.service:

# [Unit]
# Description=Shopping List Application
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
