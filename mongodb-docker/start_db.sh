#!/bin/bash

# ggf. vorher
systemctl start docker

# First Start
docker-compose up -d
# Repetitive Start
docker-compose start
# Stop Container
docker-compose stop
# Remove Container
docker-compose down
