package com.example.demo.controller;

import com.example.demo.entity.News;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.NewsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsRepository newsRepository;

    public NewsController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @PostMapping
    public ResponseEntity<News> create(@RequestBody News news) {
        News saved = newsRepository.save(news);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<News> getAll(@RequestParam(required = false) Boolean published) {
        if (Boolean.TRUE.equals(published)) {
            return newsRepository.findByPublishedTrue();
        }
        return newsRepository.findAll();
    }

    @GetMapping("/{id}")
    public News getById(@PathVariable Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found: " + id));
    }

    /** Только опубликованные новости */
    @GetMapping("/published")
    public List<News> getPublished() {
        return newsRepository.findByPublishedTrue();
    }

    @PutMapping("/{id}")
    public News update(@PathVariable Long id, @RequestBody News news) {
        News existing = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found: " + id));
        existing.setTitle(news.getTitle());
        existing.setContent(news.getContent());
        existing.setPublished(news.isPublished());
        return newsRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News not found: " + id);
        }
        newsRepository.deleteById(id);
    }
}
