package org.example.lab5.exception;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(Long id) {
        super("Student with id=" + id + " not found");
    }
}
