FROM osrf/ros:humble-desktop

# Gerekli paketleri yükle
RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb x11vnc fluxbox \
    python3-websockify novnc \
    libglu1-mesa mesa-utils libgl1-mesa-dri \
    # Diğer konteynerlerle tutarlılık için CycloneDDS
    ros-humble-rmw-cyclonedx-cpp \
    # Hata ayıklama araçları
    psmisc procps curl \
 && rm -rf /var/lib/apt/lists/* \
 && apt-get clean

# Ortam değişkenlerini ayarla
ENV DISPLAY=:0
ENV GEOMETRY=1600x900x24
ENV LIBGL_ALWAYS_SOFTWARE=1
ENV RMW_IMPLEMENTATION=rmw_cyclonedx_cpp

# Entrypoint script'ini kopyala ve ayarla
COPY rviz-entrypoint.sh /usr/local/bin/rviz-entrypoint.sh
RUN chmod +x /usr/local/bin/rviz-entrypoint.sh

# Gerekli dizinleri oluştur ve izinleri ayarla
RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

# Port'ları aç
EXPOSE 6080 5900

# Servislerin çalıştığını doğrulamak için health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:6080/ || exit 1

CMD ["/usr/local/bin/rviz-entrypoint.sh"]