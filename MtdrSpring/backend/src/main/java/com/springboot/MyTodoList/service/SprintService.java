package com.springboot.MyTodoList.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    private Map<Long, Integer> sprintContext = new HashMap<>();

    public Sprint saveSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    public Optional<Sprint> findSprintByName(String name) {
        return sprintRepository.findByName(name);
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

    public Optional<Integer> findSprintIdByName(String name) {
        Optional<Sprint> sprint = sprintRepository.findByName(name);
        return sprint.map(Sprint::getId);
    }

    public void setCurrentSprintId(long chatId, int sprintId) {
        sprintContext.put(chatId, sprintId);
    }

    public Optional<Integer> getCurrentSprintId(long chatId) {
        return Optional.ofNullable(sprintContext.get(chatId));
    }
}