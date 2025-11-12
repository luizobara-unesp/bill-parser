package com.billparser.backend.controller;

import com.billparser.backend.model.User;
import com.billparser.backend.model.Workspace;
import com.billparser.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceRepository workspaceRepository;

    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(@RequestBody Workspace newWorkspace) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        newWorkspace.setUser(currentUser);
        Workspace savedWorkspace = workspaceRepository.save(newWorkspace);
        return ResponseEntity.ok(savedWorkspace);
    }

    @GetMapping
    public ResponseEntity<List<Workspace>> getMyWorkspaces() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Workspace> workspaces = workspaceRepository.findByUserId(currentUser.getId());
        return ResponseEntity.ok(workspaces);
    }
}