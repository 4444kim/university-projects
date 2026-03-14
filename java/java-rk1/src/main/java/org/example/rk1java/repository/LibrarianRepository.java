package org.example.rk1java.repository;

import org.example.rk1java.entity.Librarian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibrarianRepository extends JpaRepository<Librarian, Long> {
    boolean existsByEmailAddress(String emailAddress);
    Page<Librarian> findByFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(String name, String email, Pageable pageable);
}
