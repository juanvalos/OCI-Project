package com.springboot.MyTodoList.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.MyTodoList.model.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Integer> {

    Optional<Sprint> findByName(String name);
}