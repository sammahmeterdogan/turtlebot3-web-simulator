FROM ros:humble-ros-base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-humble-rmw-cyclonedx-cpp \
    ros-humble-slam-toolbox && \
    rm -rf /var/lib/apt/lists/*

ENV RMW_IMPLEMENTATION=rmw_cyclonedx_cpp
ENV ROS_DOMAIN_ID=42

CMD bash -lc 'source /opt/ros/humble/setup.bash && \
  ros2 launch slam_toolbox online_async_launch.py use_sim_time:=tru