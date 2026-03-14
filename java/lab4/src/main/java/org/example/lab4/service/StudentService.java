package org.example.lab4.service;

import org.example.lab4.entity.Course;
import org.example.lab4.entity.Student;
import org.example.lab4.repository.CourseRepository;
import org.example.lab4.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentService(StudentRepository studentRepository, CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public Student save(Student student) {
        if (student.getProfile() != null) {
            student.getProfile().setStudent(student);
        }
        return studentRepository.save(student);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    @Transactional
    public Student update(Long id, Student student) {
        Student existing = findById(id);
        existing.setFirstName(student.getFirstName());
        existing.setLastName(student.getLastName());
        existing.setEmail(student.getEmail());
        if (student.getProfile() != null) {
            if (existing.getProfile() == null) {
                existing.setProfile(student.getProfile());
                existing.getProfile().setStudent(existing);
            } else {
                existing.getProfile().setAddress(student.getProfile().getAddress());
                existing.getProfile().setPhone(student.getProfile().getPhone());
                existing.getProfile().setBirthDate(student.getProfile().getBirthDate());
            }
        }
        return studentRepository.save(existing);
    }

    @Transactional
    public void deleteById(Long id) {
        studentRepository.deleteById(id);
    }

    @Transactional
    public Student assignToCourse(Long studentId, Long courseId) {
        Student student = findById(studentId);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));
        student.addCourse(course);
        return studentRepository.save(student);
    }
}
