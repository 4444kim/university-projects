package org.example.rk1java.controller;

import org.example.rk1java.dto.LibraryRequest;
import org.example.rk1java.entity.Library;
import org.example.rk1java.service.LibraryService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/libraries")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Library createLibrary(@RequestBody LibraryRequest libraryRequest) {
        return libraryService.createLibrary(libraryRequest);
    }

    @PutMapping("/{libraryId}")
    public Library updateLibrary(@PathVariable Long libraryId, @RequestBody LibraryRequest libraryRequest) {
        return libraryService.updateLibrary(libraryId, libraryRequest);
    }

    @GetMapping
    public Page<Library> getAllLibraries(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam(defaultValue = "libraryName") String sortBy,
                                         @RequestParam(defaultValue = "asc") String direction,
                                         @RequestParam(required = false) String search) {
        return libraryService.getLibraries(page, size, sortBy, direction, search);
    }

    @GetMapping("/{libraryId}")
    public Library getLibraryById(@PathVariable Long libraryId) {
        return libraryService.getLibraryById(libraryId);
    }

    @DeleteMapping("/{libraryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLibrary(@PathVariable Long libraryId) {
        libraryService.deleteLibrary(libraryId);
    }

    @PostMapping("/{libraryId}/books/{bookId}")
    public Library addBookToLibrary(@PathVariable Long libraryId, @PathVariable Long bookId) {
        return libraryService.addBookToLibrary(libraryId, bookId);
    }

    @DeleteMapping("/{libraryId}/books/{bookId}")
    public Library removeBookFromLibrary(@PathVariable Long libraryId, @PathVariable Long bookId) {
        return libraryService.removeBookFromLibrary(libraryId, bookId);
    }

    @PutMapping("/{libraryId}/librarian/{librarianId}")
    public Library assignLibrarianToLibrary(@PathVariable Long libraryId, @PathVariable Long librarianId) {
        return libraryService.assignLibrarianToLibrary(libraryId, librarianId);
    }
}
