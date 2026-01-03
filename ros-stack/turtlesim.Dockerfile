# ROS2 Humble tabanı
FROM ros:humble-ros-core

# turtlesim paketini yükle
RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-humble-turtlesim \
    && rm -rf /var/lib/apt/lists/*

# ROS Domain ID'sini ayarla (diğer servislerle aynı ağda olması için)
ENV ROS_DOMAIN_ID=${ROS_DOMAIN_ID:-42}

# turtlesim_node'u çalıştır
CMD ["bash", "-lc", "source /opt/ros/humble/setup.bash && ros2 run turtlesim turtlesim_node"]