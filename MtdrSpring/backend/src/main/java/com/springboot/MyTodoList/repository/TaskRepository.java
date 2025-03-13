package com.springboot.MyTodoList.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.MyTodoList.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByOracleUserId(int oracleUserId);

    List<Task> findBySprintId(int sprintId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.oracleUserId = :oracleUserId")
    int countByOracleUserId(@Param("oracleUserId") int oracleUserId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.oracleUserId = :oracleUserId AND t.state = 'Terminada'")
    int countByOracleUserIdAndStateTerminada(@Param("oracleUserId") int oracleUserId);

    List<Task> findByOracleUserIdAndSprintId(int oracleUserId, int sprintId);
}