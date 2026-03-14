package org.example.lab5.student.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class StudentUpdateDto {

    @Size(min = 1, message = "First name must not be blank")
    private String firstName;

    @Size(min = 1, message = "Last name must not be blank")
    private String lastName;

    @Email(message = "Email must be valid")
    private String email;

    @Min(value = 16, message = "Minimum age is 16")
    private Integer age;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
