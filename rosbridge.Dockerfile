# ROS2 Humble tabanı — küçük ve yeterli
FROM ros:humble-ros-core

# ROSBridge WebSocket sunucusu (ws://<host>:9090)
RUN apt-get update \
 && apt-get install -y --no-install-recommends ros-humble-rosbridge-server \
 && rm -rf /var/lib/apt/lists/*

ENV ROS_DOMAIN_ID=42            # Birden çok ağda çakışmayı önlemek için
EXPOSE 9090                     # KONTEYNER iç port — compose soldaki host portuna map eder

# Portu değiştirmek isterseniz compose’ta "909X:9090" şeklinde sol tarafı değiştirin.
CMD ["bash","-lc","source /opt/ros/humble/setup.bash && ros2 launch rosbridge_server rosbridge_websocket_launch.xml port:=9090"]
