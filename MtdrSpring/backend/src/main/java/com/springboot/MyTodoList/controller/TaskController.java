package com.springboot.MyTodoList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping(value = "/tasks/{oracleUserId}")
    public ResponseEntity<List<Task>> getAssignedTasks(@PathVariable int oracleUserId) {
        List<Task> tasks = taskService.getTasksByOracleUserId(oracleUserId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PostMapping(value = "/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task createdTask = taskService.saveTask(task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/tasks/completion-percentage")
    public int getCompletionPercentage(@RequestParam int oracleUserId) {
        return taskService.calculateCompletionPercentage(oracleUserId);
    }

    @GetMapping(value = "/tasksUserSprint")
    public ResponseEntity<List<Task>> getTasksByOracleUserIdAndSprintId(
            @RequestParam int oracleUserId,
            @RequestParam int sprintId) {
        List<Task> tasks = taskService.getTasksByOracleUserIdAndSprintId(oracleUserId, sprintId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
}