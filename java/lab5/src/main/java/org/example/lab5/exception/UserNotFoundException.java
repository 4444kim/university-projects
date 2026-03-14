package org.example.lab5.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User with id=" + id + " not found");
    }
}
