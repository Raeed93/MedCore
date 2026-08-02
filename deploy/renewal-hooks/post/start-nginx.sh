#!/bin/bash
cd /home/ubuntu/pulse
docker compose -f docker-compose.prod.yml start nginx
