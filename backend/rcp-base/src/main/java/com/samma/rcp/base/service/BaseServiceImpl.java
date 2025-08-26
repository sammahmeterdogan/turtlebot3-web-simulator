package com.samma.rcp.base.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public abstract class BaseServiceImpl<T, ID> implements BaseService<T, ID> {
    protected abstract JpaRepository<T, ID> getRepository();

    @Override public T save(T entity) { return getRepository().save(entity); }
    @Override public Optional<T> findById(ID id) { return getRepository().findById(id); }
    @Override public List<T> findAll() { return getRepository().findAll(); }
    @Override public void deleteById(ID id) { getRepository().deleteById(id); }
    @Override public boolean existsById(ID id) { return getRepository().existsById(id); }
    @Override public abstract T update(ID id, T entity);
}
