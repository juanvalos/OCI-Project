package com.springboot.MyTodoList.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.MyTodoList.model.BackupCode;

@Repository
public interface BackupCodeRepository extends JpaRepository<BackupCode, Long> {
    Optional<BackupCode> findByUserIdAndCodeHash(Long userId, String codeHash);
    List<BackupCode> findAllByUserId(Long userId);
}
