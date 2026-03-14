package org.example.lab4.controller;

import org.example.lab4.entity.Course;
import org.example.lab4.entity.Lesson;
import org.example.lab4.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        Course saved = courseService.save(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Long id) {
        return courseService.findById(id);
    }

    @PostMapping("/{courseId}/lessons")
    public ResponseEntity<Course> addLesson(
            @PathVariable Long courseId,
            @RequestBody Lesson lesson
    ) {
        Course course = courseService.addLesson(courseId, lesson);
        return ResponseEntity.ok(course);
    }
}
