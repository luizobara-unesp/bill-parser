package com.billparser.backend.controller;

import com.billparser.backend.dto.workspace.WorkspaceRequest;
import com.billparser.backend.dto.workspace.WorkspaceResponse;
import com.billparser.backend.model.User;
import com.billparser.backend.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<WorkspaceResponse> createWorkspace(@RequestBody WorkspaceRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        WorkspaceResponse response = workspaceService.createWorkspace(request, currentUser);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceResponse>> getMyWorkspaces() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<WorkspaceResponse> workspaces = workspaceService.getWorkspacesByUser(currentUser);

        return ResponseEntity.ok(workspaces);
    }
}