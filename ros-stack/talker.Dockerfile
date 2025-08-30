FROM ros:humble-ros-core
RUN apt-get update \
 && apt-get install -y --no-install-recommends ros-humble-demo-nodes-cpp \
 && rm -rf /var/lib/apt/lists/*
ENV ROS_DOMAIN_ID=42
CMD ["bash","-lc","source /opt/ros/humble/setup.bash && ros2 run demo_nodes_cpp talker"]
