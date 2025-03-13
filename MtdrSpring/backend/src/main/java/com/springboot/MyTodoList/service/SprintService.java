package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    public Sprint saveSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    public List<Sprint> findAllSprints() {
        return sprintRepository.findAll();
    }

    public Optional<Sprint> findSprintById(int id) {
        return sprintRepository.findById(id);
    }

    public void deleteSprintById(int id) {
        sprintRepository.deleteById(id);
    }
}