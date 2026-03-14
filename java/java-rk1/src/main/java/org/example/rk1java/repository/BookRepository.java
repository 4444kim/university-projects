package org.example.rk1java.repository;

import org.example.rk1java.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
    boolean existsByInternationalStandardBookNumber(String internationalStandardBookNumber);
    Page<Book> findByTitleContainingIgnoreCaseOrInternationalStandardBookNumberContainingIgnoreCase(String title, String isbn, Pageable pageable);
}
