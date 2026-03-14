package org.example.rk1java.controller;

import org.example.rk1java.dto.LibrarianRequest;
import org.example.rk1java.entity.Librarian;
import org.example.rk1java.service.LibrarianService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/librarians")
public class LibrarianController {

    private final LibrarianService librarianService;

    public LibrarianController(LibrarianService librarianService) {
        this.librarianService = librarianService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Librarian createLibrarian(@RequestBody LibrarianRequest librarianRequest) {
        return librarianService.createLibrarian(librarianRequest);
    }

    @PutMapping("/{librarianId}")
    public Librarian updateLibrarian(@PathVariable Long librarianId, @RequestBody LibrarianRequest librarianRequest) {
        return librarianService.updateLibrarian(librarianId, librarianRequest);
    }

    @GetMapping
    public Page<Librarian> getAllLibrarians(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            @RequestParam(defaultValue = "fullName") String sortBy,
                                            @RequestParam(defaultValue = "asc") String direction,
                                            @RequestParam(required = false) String search) {
        return librarianService.getLibrarians(page, size, sortBy, direction, search);
    }

    @GetMapping("/{librarianId}")
    public Librarian getLibrarianById(@PathVariable Long librarianId) {
        return librarianService.getLibrarianById(librarianId);
    }

    @DeleteMapping("/{librarianId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLibrarian(@PathVariable Long librarianId) {
        librarianService.deleteLibrarian(librarianId);
    }
}
