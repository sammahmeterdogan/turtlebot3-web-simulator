FROM ros:humble-ros-core

# CycloneDDS (deterministik discovery)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-humble-rmw-cyclonedds-cpp ros-humble-rosbridge-server \
 && rm -rf /var/lib/apt/lists/*

ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
ENV ROS_DOMAIN_ID=42
ENV ROS_BRIDGE_PORT=9090
EXPOSE 9090

CMD ["bash","-lc","source /opt/ros/humble/setup.bash && \
  ros2 launch rosbridge_server rosbridge_websocket_launch.xml port:=${ROS_BRIDGE_PORT}"]
