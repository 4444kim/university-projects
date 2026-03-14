package org.example.rk1java.service;

import org.example.rk1java.dto.LibrarianRequest;
import org.example.rk1java.entity.Librarian;
import org.example.rk1java.entity.Library;
import org.example.rk1java.repository.LibrarianRepository;
import org.example.rk1java.repository.LibraryRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class LibrarianService {

    private final LibrarianRepository librarianRepository;
    private final LibraryRepository libraryRepository;

    public LibrarianService(LibrarianRepository librarianRepository, LibraryRepository libraryRepository) {
        this.librarianRepository = librarianRepository;
        this.libraryRepository = libraryRepository;
    }

    public Librarian createLibrarian(LibrarianRequest librarianRequest) {
        validateFullName(librarianRequest.getFullName());
        validateEmailAddress(librarianRequest.getEmailAddress());

        if (librarianRepository.existsByEmailAddress(librarianRequest.getEmailAddress())) {
            throw new RuntimeException("Email address already exists");
        }

        Librarian librarian = new Librarian();
        librarian.setFullName(librarianRequest.getFullName().trim());
        librarian.setEmailAddress(librarianRequest.getEmailAddress().trim());

        if (librarianRequest.getLibraryId() != null) {
            Library library = libraryRepository.findById(librarianRequest.getLibraryId())
                    .orElseThrow(() -> new RuntimeException("Library not found"));
            if (library.getLibrarian() != null) {
                throw new RuntimeException("Library already has a librarian");
            }
            librarian.setLibrary(library);
            library.setLibrarian(librarian);
        }

        return librarianRepository.save(librarian);
    }

    public Librarian updateLibrarian(Long librarianId, LibrarianRequest librarianRequest) {
        validateFullName(librarianRequest.getFullName());
        validateEmailAddress(librarianRequest.getEmailAddress());

        Librarian librarian = getLibrarianById(librarianId);

        if (!librarian.getEmailAddress().equals(librarianRequest.getEmailAddress())
                && librarianRepository.existsByEmailAddress(librarianRequest.getEmailAddress())) {
            throw new RuntimeException("Email address already exists");
        }

        librarian.setFullName(librarianRequest.getFullName().trim());
        librarian.setEmailAddress(librarianRequest.getEmailAddress().trim());

        if (librarianRequest.getLibraryId() != null) {
            Library library = libraryRepository.findById(librarianRequest.getLibraryId())
                    .orElseThrow(() -> new RuntimeException("Library not found"));
            if (library.getLibrarian() != null && !library.getLibrarian().getLibrarianId().equals(librarian.getLibrarianId())) {
                throw new RuntimeException("Library already has a librarian");
            }

            Library oldLibrary = librarian.getLibrary();
            if (oldLibrary != null && !oldLibrary.getLibraryId().equals(library.getLibraryId())) {
                oldLibrary.setLibrarian(null);
            }

            librarian.setLibrary(library);
            library.setLibrarian(librarian);
        }

        return librarianRepository.save(librarian);
    }

    public Page<Librarian> getLibrarians(int page, int size, String sortBy, String direction, String search) {
        validatePageable(page, size);
        Sort sort = buildSort(sortBy, direction);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            String term = search.trim();
            return librarianRepository.findByFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(term, term, pageable);
        }
        return librarianRepository.findAll(pageable);
    }

    public Librarian getLibrarianById(Long librarianId) {
        return librarianRepository.findById(librarianId)
                .orElseThrow(() -> new RuntimeException("Librarian not found"));
    }

    public void deleteLibrarian(Long librarianId) {
        Librarian librarian = getLibrarianById(librarianId);
        Library library = librarian.getLibrary();
        if (library != null) {
            library.setLibrarian(null);
        }
        librarianRepository.delete(librarian);
    }

    private void validateFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new RuntimeException("Full name is required");
        }
        if (fullName.trim().length() < 2 || fullName.trim().length() > 100) {
            throw new RuntimeException("Full name length must be 2-100");
        }
    }

    private void validateEmailAddress(String emailAddress) {
        if (emailAddress == null || emailAddress.trim().isEmpty()) {
            throw new RuntimeException("Email address is required");
        }
        String trimmedValue = emailAddress.trim();
        if (!trimmedValue.contains("@") || trimmedValue.length() < 5 || trimmedValue.length() > 100) {
            throw new RuntimeException("Email address is invalid");
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
        String property = (sortBy == null || sortBy.isBlank()) ? "fullName" : sortBy;
        Sort.Direction dir;
        try {
            dir = Sort.Direction.fromString(direction == null ? "ASC" : direction);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid sort direction");
        }
        return Sort.by(dir, property);
    }
}
