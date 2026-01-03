FROM ros:humble-ros-base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-humble-rmw-cyclonedds-cpp \
    git python3-colcon-common-extensions \
    ros-humble-gazebo-ros-pkgs ros-humble-xacro \
    ros-humble-nav2-bringup ros-humble-slam-toolbox \
    ros-humble-turtlebot3-msgs ros-humble-turtlebot3-description \
 && rm -rf /var/lib/apt/lists/*

ENV WS=/opt/tb3_ws
RUN mkdir -p $WS/src && cd $WS/src && \
    git clone -b humble-devel https://github.com/ROBOTIS-GIT/turtlebot3_simulations.git && \
    /bin/bash -c "source /opt/ros/humble/setup.bash && cd $WS && colcon build --symlink-install"

# HATA DÜZELTİLDİ: 'rmw_cyclonedds_cppe' -> 'rmw_cyclonedds_cpp'
ENV RMW_IMPLEMENTATION=rmw_cyclonedds_cpp

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# TurtleBot3 simülasyonunu başlatmak için varsayılan komut
CMD ["ros2", "launch", "turtlebot3_gazebo", "turtlebot3_world.launch.py"]