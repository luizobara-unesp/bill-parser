package com.billparser.backend.service;

import com.billparser.backend.dto.user.UserResponse;
import com.billparser.backend.dto.user.UserUpdateRequest;
import com.billparser.backend.model.User;
import com.billparser.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.public-url}")
    private String publicUrl;

    public UserResponse mapToDTO(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    @Transactional
    public UserResponse updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return mapToDTO(user);
    }

    @Transactional
    public UserResponse uploadAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        try {
            if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
                try {
                    String oldFileName = extractKeyFromUrl(user.getAvatarUrl());

                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(oldFileName)
                            .build());
                } catch (Exception e) {
                    System.err.println("Falha ao deletar imagem antiga: " + e.getMessage());
                }
            }

            String fileName = "avatars/user-" + userId + "-" + UUID.randomUUID() + getFileExtension(file.getOriginalFilename());

            PutObjectRequest putOb = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putOb, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String fileUrl = String.format("%s/%s/%s", publicUrl, bucketName, fileName);

            user.setAvatarUrl(fileUrl);
            User savedUser = userRepository.save(user);

            return mapToDTO(savedUser);

        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload da imagem", e);
        }
    }

    private String extractKeyFromUrl(String fullUrl) {
        String prefixToRemove = publicUrl + "/" + bucketName + "/";
        if (fullUrl.startsWith(prefixToRemove)) {
            return fullUrl.substring(prefixToRemove.length());
        }
        return fullUrl;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}