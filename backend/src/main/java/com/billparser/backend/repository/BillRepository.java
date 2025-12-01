package com.billparser.backend.repository;

import com.billparser.backend.model.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Page<Bill> findAllByWorkspaceId(Long workspaceId, Pageable pageable);
    List<Bill> findAllByWorkspaceIdOrderByDueDateAsc(Long workspaceId);
}