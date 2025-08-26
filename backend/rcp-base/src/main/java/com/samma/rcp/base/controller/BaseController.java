package com.samma.rcp.base.controller;

import com.samma.rcp.base.dto.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {
    protected <T> ResponseEntity<ResponseDTO<T>> success(T data) {
        return ResponseEntity.ok(ResponseDTO.<T>builder().success(true).data(data).build());
    }
    protected <T> ResponseEntity<ResponseDTO<T>> success(T data, String message) {
        return ResponseEntity.ok(ResponseDTO.<T>builder().success(true).data(data).message(message).build());
    }
    protected <T> ResponseEntity<ResponseDTO<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseDTO.<T>builder().success(true).data(data).build());
    }
    protected <T> ResponseEntity<ResponseDTO<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(ResponseDTO.<T>builder().success(false).message(message).build());
    }
}
