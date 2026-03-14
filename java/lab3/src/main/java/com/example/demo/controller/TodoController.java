package com.example.demo.controller;

import com.example.demo.entity.Todo;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.TodoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @PostMapping
    public ResponseEntity<Todo> create(@RequestBody Todo todo) {
        Todo saved = todoRepository.save(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Todo> getAll(@RequestParam(required = false) Boolean completed) {
        if (Boolean.TRUE.equals(completed)) {
            return todoRepository.findByCompletedTrue();
        }
        return todoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Todo getById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found: " + id));
    }

    /** Только выполненные задачи */
    @GetMapping("/completed")
    public List<Todo> getCompleted() {
        return todoRepository.findByCompletedTrue();
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo todo) {
        Todo existing = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found: " + id));
        existing.setTitle(todo.getTitle());
        existing.setCompleted(todo.isCompleted());
        return todoRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Todo not found: " + id);
        }
        todoRepository.deleteById(id);
    }
}
