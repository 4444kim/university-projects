package org.example.lab5.student.service;

import java.util.List;
import java.util.stream.Collectors;
import org.example.lab5.exception.DuplicateEmailException;
import org.example.lab5.exception.StudentNotFoundException;
import org.example.lab5.student.dto.StudentCreateDto;
import org.example.lab5.student.dto.StudentResponseDto;
import org.example.lab5.student.dto.StudentUpdateDto;
import org.example.lab5.student.mapper.StudentMapper;
import org.example.lab5.student.model.Student;
import org.example.lab5.student.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper mapper;

    public StudentService(StudentRepository studentRepository, StudentMapper mapper) {
        this.studentRepository = studentRepository;
        this.mapper = mapper;
    }

    public StudentResponseDto create(StudentCreateDto dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEmailException(dto.getEmail());
        }
        Student student = mapper.toEntity(dto);
        Student saved = studentRepository.save(student);
        return mapper.toResponse(saved);
    }

    public StudentResponseDto update(Long id, StudentUpdateDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equals(student.getEmail())) {
            if (studentRepository.existsByEmail(dto.getEmail())) {
                throw new DuplicateEmailException(dto.getEmail());
            }
        }

        mapper.applyUpdates(dto, student);
        Student saved = studentRepository.save(student);
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public StudentResponseDto getById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        return mapper.toResponse(student);
    }

    @Transactional(readOnly = true)
    public List<StudentResponseDto> getAll() {
        return studentRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        studentRepository.deleteById(id);
    }
}
