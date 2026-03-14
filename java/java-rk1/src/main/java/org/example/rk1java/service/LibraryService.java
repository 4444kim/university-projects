package org.example.rk1java.service;

import org.example.rk1java.dto.LibraryRequest;
import org.example.rk1java.entity.Book;
import org.example.rk1java.entity.Librarian;
import org.example.rk1java.entity.Library;
import org.example.rk1java.repository.BookRepository;
import org.example.rk1java.repository.LibrarianRepository;
import org.example.rk1java.repository.LibraryRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final BookRepository bookRepository;
    private final LibrarianRepository librarianRepository;

    public LibraryService(LibraryRepository libraryRepository, BookRepository bookRepository, LibrarianRepository librarianRepository) {
        this.libraryRepository = libraryRepository;
        this.bookRepository = bookRepository;
        this.librarianRepository = librarianRepository;
    }

    public Library createLibrary(LibraryRequest libraryRequest) {
        validateLibraryName(libraryRequest.getLibraryName());
        validateLibraryAddress(libraryRequest.getLibraryAddress());

        Library library = new Library();
        library.setLibraryName(libraryRequest.getLibraryName().trim());
        library.setLibraryAddress(libraryRequest.getLibraryAddress().trim());

        if (libraryRequest.getLibrarianId() != null) {
            Librarian librarian = librarianRepository.findById(libraryRequest.getLibrarianId())
                    .orElseThrow(() -> new RuntimeException("Librarian not found"));
            if (librarian.getLibrary() != null) {
                throw new RuntimeException("Librarian already assigned to a library");
            }
            library.setLibrarian(librarian);
            librarian.setLibrary(library);
        }

        if (libraryRequest.getBookIds() != null) {
            Set<Book> books = new HashSet<>();
            for (Long bookId : libraryRequest.getBookIds()) {
                Book book = bookRepository.findById(bookId)
                        .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));
                books.add(book);
            }
            library.setBooks(books);
        }

        return libraryRepository.save(library);
    }

    public Library updateLibrary(Long libraryId, LibraryRequest libraryRequest) {
        validateLibraryName(libraryRequest.getLibraryName());
        validateLibraryAddress(libraryRequest.getLibraryAddress());

        Library library = getLibraryById(libraryId);
        library.setLibraryName(libraryRequest.getLibraryName().trim());
        library.setLibraryAddress(libraryRequest.getLibraryAddress().trim());

        if (libraryRequest.getLibrarianId() != null) {
            Librarian newLibrarian = librarianRepository.findById(libraryRequest.getLibrarianId())
                    .orElseThrow(() -> new RuntimeException("Librarian not found"));

            if (newLibrarian.getLibrary() != null && !newLibrarian.getLibrary().getLibraryId().equals(library.getLibraryId())) {
                throw new RuntimeException("Librarian already assigned to a library");
            }

            Librarian oldLibrarian = library.getLibrarian();
            if (oldLibrarian != null && !oldLibrarian.getLibrarianId().equals(newLibrarian.getLibrarianId())) {
                oldLibrarian.setLibrary(null);
            }

            library.setLibrarian(newLibrarian);
            newLibrarian.setLibrary(library);
        }

        if (libraryRequest.getBookIds() != null) {
            Set<Book> books = new HashSet<>();
            for (Long bookId : libraryRequest.getBookIds()) {
                Book book = bookRepository.findById(bookId)
                        .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));
                books.add(book);
            }
            library.setBooks(books);
        }

        return libraryRepository.save(library);
    }

    public Page<Library> getLibraries(int page, int size, String sortBy, String direction, String search) {
        validatePageable(page, size);
        Sort sort = buildSort(sortBy, direction);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            String term = search.trim();
            return libraryRepository.findByLibraryNameContainingIgnoreCaseOrLibraryAddressContainingIgnoreCase(term, term, pageable);
        }
        return libraryRepository.findAll(pageable);
    }

    public Library getLibraryById(Long libraryId) {
        return libraryRepository.findById(libraryId)
                .orElseThrow(() -> new RuntimeException("Library not found"));
    }

    public void deleteLibrary(Long libraryId) {
        Library library = getLibraryById(libraryId);
        Librarian librarian = library.getLibrarian();
        if (librarian != null) {
            librarian.setLibrary(null);
        }
        libraryRepository.delete(library);
    }

    public Library addBookToLibrary(Long libraryId, Long bookId) {
        Library library = getLibraryById(libraryId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        library.getBooks().add(book);
        return libraryRepository.save(library);
    }

    public Library removeBookFromLibrary(Long libraryId, Long bookId) {
        Library library = getLibraryById(libraryId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        library.getBooks().remove(book);
        return libraryRepository.save(library);
    }

    public Library assignLibrarianToLibrary(Long libraryId, Long librarianId) {
        Library library = getLibraryById(libraryId);
        Librarian librarian = librarianRepository.findById(librarianId)
                .orElseThrow(() -> new RuntimeException("Librarian not found"));

        if (librarian.getLibrary() != null && !librarian.getLibrary().getLibraryId().equals(libraryId)) {
            throw new RuntimeException("Librarian already assigned to a library");
        }

        Librarian oldLibrarian = library.getLibrarian();
        if (oldLibrarian != null && !oldLibrarian.getLibrarianId().equals(librarian.getLibrarianId())) {
            oldLibrarian.setLibrary(null);
        }

        library.setLibrarian(librarian);
        librarian.setLibrary(library);
        return libraryRepository.save(library);
    }

    private void validateLibraryName(String libraryName) {
        if (libraryName == null || libraryName.trim().isEmpty()) {
            throw new RuntimeException("Library name is required");
        }
        if (libraryName.trim().length() < 2 || libraryName.trim().length() > 100) {
            throw new RuntimeException("Library name length must be 2-100");
        }
    }

    private void validateLibraryAddress(String libraryAddress) {
        if (libraryAddress == null || libraryAddress.trim().isEmpty()) {
            throw new RuntimeException("Library address is required");
        }
        if (libraryAddress.trim().length() < 5 || libraryAddress.trim().length() > 200) {
            throw new RuntimeException("Library address length must be 5-200");
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
        String property = (sortBy == null || sortBy.isBlank()) ? "libraryName" : sortBy;
        Sort.Direction dir;
        try {
            dir = Sort.Direction.fromString(direction == null ? "ASC" : direction);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid sort direction");
        }
        return Sort.by(dir, property);
    }
}
