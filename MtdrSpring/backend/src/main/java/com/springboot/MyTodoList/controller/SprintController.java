package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}