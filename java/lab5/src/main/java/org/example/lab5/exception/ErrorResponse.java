package org.example.lab5.exception;

import java.time.Instant;
import java.util.Map;

public class ErrorResponse {
    private Instant timestamp = Instant.now();
    private String message;
    private String path;
    private Map<String, String> fieldErrors;

    public ErrorResponse() {
    }

    public ErrorResponse(String message, String path) {
        this.message = message;
        this.path = path;
    }

    public ErrorResponse(String message, String path, Map<String, String> fieldErrors) {
        this.message = message;
        this.path = path;
        this.fieldErrors = fieldErrors;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
