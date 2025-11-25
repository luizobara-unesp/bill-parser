package com.billparser.backend.dto.user;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String avatarUrl;
}