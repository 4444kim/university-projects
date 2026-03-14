package org.example.lab5.student.mapper;

import java.time.Instant;
import org.example.lab5.student.dto.StudentCreateDto;
import org.example.lab5.student.dto.StudentResponseDto;
import org.example.lab5.student.dto.StudentUpdateDto;
import org.example.lab5.student.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public Student toEntity(StudentCreateDto dto) {
        Student student = new Student();
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setAge(dto.getAge());
        student.setCreatedAt(Instant.now());
        return student;
    }

    public StudentResponseDto toResponse(Student student) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setAge(student.getAge());
        dto.setCreatedAt(student.getCreatedAt());
        return dto;
    }

    public void applyUpdates(StudentUpdateDto updateDto, Student student) {
        if (updateDto.getFirstName() != null && !updateDto.getFirstName().isBlank()) {
            student.setFirstName(updateDto.getFirstName());
        }
        if (updateDto.getLastName() != null && !updateDto.getLastName().isBlank()) {
            student.setLastName(updateDto.getLastName());
        }
        if (updateDto.getEmail() != null && !updateDto.getEmail().isBlank()) {
            student.setEmail(updateDto.getEmail());
        }
        if (updateDto.getAge() != null) {
            student.setAge(updateDto.getAge());
        }
    }
}
