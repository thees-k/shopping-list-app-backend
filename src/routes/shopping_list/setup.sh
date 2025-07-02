#!/usr/bin/env bash

echo "Copying static files..."
cp -rv ./src/routes/shopping_list/public ./built/routes/shopping_list/ || { echo "ERROR"; exit 1; }
echo "Done."
echo






