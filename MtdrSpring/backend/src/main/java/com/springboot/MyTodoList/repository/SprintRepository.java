package com.springboot.MyTodoList.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.MyTodoList.model.Sprint;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Integer> {
}