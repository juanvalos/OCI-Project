package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;

@RestController
public class SprintController {

    @Autowired
    private SprintService sprintService;

    @GetMapping(value = "/sprints")
    public ResponseEntity<List<Sprint>> getAllSprints() {
        List<Sprint> sprints = sprintService.findAllSprints();
        return new ResponseEntity<>(sprints, HttpStatus.OK);
    }
    
    @PostMapping(value =  "/sprints")
    public ResponseEntity<Sprint> createSprint(@RequestBody Sprint sprint) {
        Sprint createdSprint = sprintService.saveSprint(sprint);
        return new ResponseEntity<>(createdSprint, HttpStatus.CREATED);
    }

    @GetMapping(value = "/sprints/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable("id") int id) {
        Optional<Sprint> sprint = sprintService.findSprintById(id);
        return sprint.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping(value = "/sprints/{id}")
    public ResponseEntity<Void> deleteSprintById(@PathVariable("id") int id) {
        Optional<Sprint> sprint = sprintService.findSprintById(id);
        if (sprint.isPresent()) {
            sprintService.deleteSprintById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}