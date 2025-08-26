package com.samma.rcp.app.domain.repo;

import com.samma.rcp.app.domain.entity.SavedMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedMapRepository extends JpaRepository<SavedMap, Long> {
    Optional<SavedMap> findByName(String name);
    boolean existsByName(String name);
}
