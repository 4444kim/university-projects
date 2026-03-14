package org.example.lab4.service;

import org.example.lab4.entity.Course;
import org.example.lab4.entity.Lesson;
import org.example.lab4.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional
    public Course save(Course course) {
        if (course.getLessons() != null && !course.getLessons().isEmpty()) {
            for (Lesson lesson : course.getLessons()) {
                lesson.setCourse(course);
            }
        }
        return courseRepository.save(course);
    }

    public Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
    }

    @Transactional
    public Course addLesson(Long courseId, Lesson lesson) {
        Course course = findById(courseId);
        course.addLesson(lesson);
        return courseRepository.save(course);
    }
}
