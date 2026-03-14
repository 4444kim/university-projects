package org.example.rk1java.service;

import org.example.rk1java.dto.BookRequest;
import org.example.rk1java.entity.Book;
import org.example.rk1java.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book createBook(BookRequest bookRequest) {
        validateTitle(bookRequest.getTitle());
        validateInternationalStandardBookNumber(bookRequest.getInternationalStandardBookNumber());

        if (bookRepository.existsByInternationalStandardBookNumber(bookRequest.getInternationalStandardBookNumber())) {
            throw new RuntimeException("International Standard Book Number already exists");
        }

        Book book = new Book();
        book.setTitle(bookRequest.getTitle().trim());
        book.setInternationalStandardBookNumber(bookRequest.getInternationalStandardBookNumber().trim());
        return bookRepository.save(book);
    }

    public Book updateBook(Long bookId, BookRequest bookRequest) {
        validateTitle(bookRequest.getTitle());
        validateInternationalStandardBookNumber(bookRequest.getInternationalStandardBookNumber());

        Book book = getBookById(bookId);

        if (!book.getInternationalStandardBookNumber().equals(bookRequest.getInternationalStandardBookNumber())
                && bookRepository.existsByInternationalStandardBookNumber(bookRequest.getInternationalStandardBookNumber())) {
            throw new RuntimeException("International Standard Book Number already exists");
        }

        book.setTitle(bookRequest.getTitle().trim());
        book.setInternationalStandardBookNumber(bookRequest.getInternationalStandardBookNumber().trim());
        return bookRepository.save(book);
    }

    public Page<Book> getBooks(int page, int size, String sortBy, String direction, String search) {
        validatePageable(page, size);
        Sort sort = buildSort(sortBy, direction);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            String term = search.trim();
            return bookRepository.findByTitleContainingIgnoreCaseOrInternationalStandardBookNumberContainingIgnoreCase(term, term, pageable);
        }
        return bookRepository.findAll(pageable);
    }

    public Book getBookById(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public void deleteBook(Long bookId) {
        Book book = getBookById(bookId);
        if (!book.getLibraries().isEmpty()) {
            throw new RuntimeException("Book is linked to libraries");
        }
        bookRepository.delete(book);
    }

    private void validateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (title.trim().length() < 2 || title.trim().length() > 100) {
            throw new RuntimeException("Title length must be 2-100");
        }
    }

    private void validateInternationalStandardBookNumber(String internationalStandardBookNumber) {
        if (internationalStandardBookNumber == null || internationalStandardBookNumber.trim().isEmpty()) {
            throw new RuntimeException("International Standard Book Number is required");
        }
        String trimmedValue = internationalStandardBookNumber.trim();
        if (trimmedValue.length() < 10 || trimmedValue.length() > 20) {
            throw new RuntimeException("International Standard Book Number length must be 10-20");
        }
    }

    private void validatePageable(int page, int size) {
        if (page < 0) {
            throw new RuntimeException("Page must be >= 0");
        }
        if (size <= 0 || size > 100) {
            throw new RuntimeException("Size must be 1-100");
        }
    }

    private Sort buildSort(String sortBy, String direction) {
        String property = (sortBy == null || sortBy.isBlank()) ? "title" : sortBy;
        Sort.Direction dir;
        try {
            dir = Sort.Direction.fromString(direction == null ? "ASC" : direction);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid sort direction");
        }
        return Sort.by(dir, property);
    }
}
