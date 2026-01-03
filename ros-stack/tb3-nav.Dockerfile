FROM ros:humble-ros-base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-humble-rmw-cyclonedds-cpp \
    ros-humble-navigation2 ros-humble-nav2-bringup && \
    rm -rf /var/lib/apt/lists/*

ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
ENV ROS_DOMAIN_ID=${ROS_DOMAIN_ID:-42}
ENV ROS_DOMAIN_ID=42
ENV MAP_FILE=/maps/map.yaml

CMD bash -lc 'source /opt/ros/humble/setup.bash && \
  ros2 launch nav2_bringup navigation_launch.py \
  use_sim_time:=true map:=${MAP_FILE}'