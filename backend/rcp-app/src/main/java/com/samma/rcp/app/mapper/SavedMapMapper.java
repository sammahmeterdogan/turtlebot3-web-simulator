package com.samma.rcp.app.mapper;

import com.samma.rcp.app.domain.entity.SavedMap;
import com.samma.rcp.app.dto.SavedMapDTO;
import org.mapstruct.Mapper;

@Mapper(config = MapStructConfig.class)
public interface SavedMapMapper {
    SavedMapDTO toDto(SavedMap e);
    SavedMap toEntity(SavedMapDTO d);
}
