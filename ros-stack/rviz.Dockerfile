FROM osrf/ros:humble-desktop

# Gerekli paketleri yükle
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb x11vnc fluxbox \
    python3-websockify novnc \
    libglu1-mesa mesa-utils libgl1-mesa-dri \
    # Diğer konteynerlerle tutarlılık için CycloneDDS
    ros-humble-rmw-cyclonedds-cpp \
    # CRLF -> LF dönüşümü için
    dos2unix \
    # Hata ayıklama araçları
    psmisc procps curl \
 && rm -rf /var/lib/apt/lists/* \
 && apt-get clean

# Ortam değişkenlerini ayarla
ENV DISPLAY=:0
ENV GEOMETRY=1600x900x24
ENV LIBGL_ALWAYS_SOFTWARE=1
ENV ROS_DOMAIN_ID=${ROS_DOMAIN_ID:-42}
ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp

# Entrypoint script'ini kopyala ve ayarla (CRLF -> LF dönüşümü)
COPY rviz-entrypoint.sh /usr/local/bin/rviz-entrypoint.sh
RUN dos2unix /usr/local/bin/rviz-entrypoint.sh && \
    chmod +x /usr/local/bin/rviz-entrypoint.sh

# Create index.html redirect to vnc.html (foolproof fallback)
RUN echo '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/vnc.html?autoconnect=true&resize=remote"></head><body>Redirecting to noVNC...</body></html>' > /usr/share/novnc/index.html

# Gerekli dizinleri oluştur ve izinleri ayarla
RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

# Port'ları aç
EXPOSE 6080 5900

# Servislerin çalıştığını doğrulamak için health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:6080/ || exit 1

CMD ["/usr/local/bin/rviz-entrypoint.sh"]