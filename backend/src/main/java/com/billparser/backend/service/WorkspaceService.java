package com.billparser.backend.service;

import com.billparser.backend.dto.workspace.WorkspaceRequest;
import com.billparser.backend.dto.workspace.WorkspaceResponse;
import com.billparser.backend.model.User;
import com.billparser.backend.model.Workspace;
import com.billparser.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    @Transactional
    public WorkspaceResponse createWorkspace(WorkspaceRequest request, User owner) {
        Workspace workspace = new Workspace();
        workspace.setName(request.getName());
        workspace.setUser(owner);

        Workspace savedWorkspace = workspaceRepository.save(workspace);
        return mapToDTO(savedWorkspace);
    }

    public List<WorkspaceResponse> getWorkspacesByUser(User user) {
        List<Workspace> workspaces = workspaceRepository.findByUserId(user.getId());

        return workspaces.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private WorkspaceResponse mapToDTO(Workspace workspace) {
        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .ownerId(workspace.getUser().getId())
                .build();
    }
}