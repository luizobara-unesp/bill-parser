package com.billparser.backend.controller;

import com.billparser.backend.dto.user.UserResponse;
import com.billparser.backend.dto.user.UserUpdateRequest;
import com.billparser.backend.model.User;
import com.billparser.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(userService.mapToDTO(currentUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@RequestBody UserUpdateRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserResponse response = userService.updateUser(currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> uploadAvatar(@RequestParam("file") MultipartFile file) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserResponse response = userService.uploadAvatar(currentUser.getId(), file);
        return ResponseEntity.ok(response);
    }
}