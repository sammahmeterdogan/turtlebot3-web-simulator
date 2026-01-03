#!/usr/bin/env bash
set -euo pipefail

# AMENT değişkenini export et (unbound variable hatasını önlemek için)
export AMENT_TRACE_SETUP_FILES=${AMENT_TRACE_SETUP_FILES:-}

# Daha agresif temizlik
echo "[entrypoint] Mevcut X11 işlemlerini temizleniyor..."
pkill -9 -f "Xvfb" || true
pkill -9 -f "x11vnc" || true
pkill -9 -f "fluxbox" || true
pkill -9 -f "websockify" || true
pkill -9 -f "novnc" || true
sleep 2

# X11 lock ve socket dosyalarını temizle
rm -rf /tmp/.X*-lock /tmp/.X11-unix/X* || true
mkdir -p /tmp/.X11-unix
chmod 1777 /tmp/.X11-unix

echo "[entrypoint] Xvfb başlatılıyor: ${DISPLAY} - ${GEOMETRY}"
Xvfb "${DISPLAY}" -screen 0 "${GEOMETRY}" -ac +render -noreset -dpi 96 &
XVFB_PID=$!

# Xvfb'nin başlamasını bekle
sleep 3

# Xvfb çalışıyor mu kontrol et
if ! kill -0 $XVFB_PID 2>/dev/null; then
    echo "HATA: Xvfb başlatılamadı"
    exit 1
fi

echo "[entrypoint] fluxbox başlatılıyor"
DISPLAY=${DISPLAY} fluxbox > /tmp/fluxbox.log 2>&1 &
sleep 2

echo "[entrypoint] x11vnc başlatılıyor - port 5900"
x11vnc -display "${DISPLAY}" -rfbport 5900 -forever -shared -nopw -quiet -bg -o /tmp/x11vnc.log

sleep 2

# websockify kontrolü
if command -v websockify >/dev/null 2>&1; then
  echo "[entrypoint] websockify başlatılıyor :6080 -> :5900"
  websockify --web=/usr/share/novnc/ 6080 localhost:5900 > /tmp/websockify.log 2>&1 &
elif [ -x /usr/share/novnc/utils/novnc_proxy ]; then
  echo "[entrypoint] novnc_proxy başlatılıyor :6080 -> :5900"
  /usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 6080 > /tmp/novnc.log 2>&1 &
else
  echo "UYARI: websockify veya novnc_proxy bulunamadı"
fi

sleep 3

# ROS ortamını yükle
source /opt/ros/humble/setup.bash

# ROS domain ID'yi ayarla
export ROS_DOMAIN_ID=${ROS_DOMAIN_ID:-42}
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp

echo "[entrypoint] ROS ortamı hazır"
echo "  ROS_DOMAIN_ID: $ROS_DOMAIN_ID"
echo "  RMW_IMPLEMENTATION: $RMW_IMPLEMENTATION"
echo "  DISPLAY: $DISPLAY"

# RViz başlat
echo "[entrypoint] rviz2 başlatılıyor"
exec rviz2