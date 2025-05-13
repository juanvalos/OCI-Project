package com.springboot.MyTodoList.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping(value = "/sprints/ids")
    public ResponseEntity<Integer> getSprintIdByName(@RequestParam String name) {
        Optional<Sprint> sprint = sprintService.findSprintByName(name);
        return sprint.map(value -> new ResponseEntity<>(value.getId(), HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping(value = "/sprints/totalHours")
    public ResponseEntity<Map<String, Float>> getTotalHoursWorkedPerSprint() {
        Map<String, Float> totalHoursPerSprint = sprintService.getTotalHoursWorkedPerSprint();
        return new ResponseEntity<>(totalHoursPerSprint, HttpStatus.OK);
    }

    @GetMapping(value = "/sprints/user-hours")
    public ResponseEntity<List<Map<String, Object>>> getTotalHoursPerUserPerSprint() {
        List<Map<String, Object>> result = sprintService.getTotalHoursPerUserPerSprint();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "/sprints/completed-tasks")
    public ResponseEntity<List<Map<String, Object>>> getCompletedTasksPerUserPerSprint() {
        List<Map<String, Object>> result = sprintService.getCompletedTasksPerUserPerSprint();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}