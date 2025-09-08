#!/usr/bin/env bash
set -e

Xvfb ${DISPLAY} -screen 0 ${GEOMETRY} -ac +render -noreset &
sleep 0.5

fluxbox &

x11vnc -display ${DISPLAY} -rfbport 5900 -forever -shared -nopw -quiet &

websockify --web=/usr/share/novnc/ 6080 localhost:5900 &

source /opt/ros/humble/setup.bash

# İstersen RViz config dosyası ver:
# rviz2 -d /configs/your_config.rviz
rviz2
