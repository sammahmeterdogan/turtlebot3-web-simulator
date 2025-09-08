FROM osrf/ros:humble-desktop

RUN apt-get update && apt-get install -y --no-install-recommends \
    xvfb x11vnc fluxbox \
    python3-websockify novnc \
    libglu1-mesa mesa-utils libgl1-mesa-dri \
 && rm -rf /var/lib/apt/lists/*

ENV DISPLAY=:0
ENV GEOMETRY=1600x900x24
ENV LIBGL_ALWAYS_SOFTWARE=1

COPY rviz-entrypoint.sh /usr/local/bin/rviz-entrypoint.sh
RUN chmod +x /usr/local/bin/rviz-entrypoint.sh

EXPOSE 6080 5900
CMD ["/usr/local/bin/rviz-entrypoint.sh"]