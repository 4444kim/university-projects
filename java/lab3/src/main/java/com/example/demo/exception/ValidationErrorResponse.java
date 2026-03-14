package com.example.demo.exception;

import java.util.ArrayList;
import java.util.List;

/** Ответ с ошибками валидации в формате JSON */
public class ValidationErrorResponse {

    private List<String> errors = new ArrayList<>();

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public void addError(String error) {
        this.errors.add(error);
    }
}
