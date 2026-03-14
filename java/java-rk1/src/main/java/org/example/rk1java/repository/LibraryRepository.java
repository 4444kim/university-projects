package org.example.rk1java.repository;

import org.example.rk1java.entity.Library;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    Page<Library> findByLibraryNameContainingIgnoreCaseOrLibraryAddressContainingIgnoreCase(String name, String address, Pageable pageable);
}
