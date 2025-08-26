package com.samma.rcp.app.mapper;

import com.samma.rcp.app.domain.entity.RobotConfig;
import com.samma.rcp.app.dto.RobotConfigDTO;
import org.mapstruct.Mapper;

@Mapper(config = MapStructConfig.class)
public interface RobotConfigMapper {
    RobotConfigDTO toDto(RobotConfig e);
    RobotConfig toEntity(RobotConfigDTO d);
}
