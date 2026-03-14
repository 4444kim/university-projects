package org.example.lab5.user.service;

import org.example.lab5.exception.DuplicateEmailException;
import org.example.lab5.exception.UserNotFoundException;
import org.example.lab5.user.dto.UserRegistrationDto;
import org.example.lab5.user.dto.UserResponseDto;
import org.example.lab5.user.mapper.UserMapper;
import org.example.lab5.user.model.User;
import org.example.lab5.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper mapper;

    public UserService(UserRepository userRepository, UserMapper mapper) {
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    public UserResponseDto register(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEmailException(dto.getEmail());
        }
        User user = mapper.toEntity(dto);
        User saved = userRepository.save(user);
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return mapper.toResponse(user);
    }
}
