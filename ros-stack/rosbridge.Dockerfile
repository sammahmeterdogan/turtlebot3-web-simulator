# File: rosbridge.Dockerfile

FROM ros:humble-ros-core

# CycloneDDS (deterministic discovery)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-humble-rmw-cyclonedds-cpp \
    ros-humble-rosbridge-server \
 && rm -rf /var/lib/apt/lists/*

# Correct RMW selection and domain settings
# Use fixed domain ID to avoid conflicts in multi-network setups
ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
ENV ROS_DOMAIN_ID=42
ENV ROS_BRIDGE_PORT=9090

EXPOSE 9090

# Use bash login shell for proper sourcing
SHELL ["/bin/bash", "-lc"]

CMD set +u; \
    source /opt/ros/humble/setup.bash; \
    ros2 launch rosbridge_server rosbridge_websocket_launch.xml port:=${ROS_BRIDGE_PORT}