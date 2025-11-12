package com.billparser.backend.repository;

import com.billparser.backend.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByUserId(Long userId);
}