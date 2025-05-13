package com.springboot.MyTodoList.controller;

import java.util.HashMap;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.AuthService;
import com.springboot.MyTodoList.service.TaskService;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private AuthService userService;

    @GetMapping(value = "/tasksbySprintId")
    public ResponseEntity<List<Task>> getTasksBySprintId(@RequestParam int sprintId) {
        List<Task> tasks = taskService.getTasksBySprintId(sprintId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    
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

    @PutMapping(value = "/tasks/state/{id}") // Nueva ruta para actualizar el estado
    public ResponseEntity<Task> updateTaskState(@PathVariable int id, @RequestParam String newState) {
        Task updatedTask = taskService.updateTaskState(id, newState);
        if (updatedTask != null) {
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(value = "/tasks/hours/{id}")
    public ResponseEntity<Task> updateTaskHours(@PathVariable int id, @RequestParam Float actualHours) {
        Task updatedTask = taskService.updateTaskHours(id, actualHours);
        if (updatedTask != null) {
            return new ResponseEntity<>(updatedTask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/taskDetails/{id}")
    public ResponseEntity<Task> getTaskDetails(@PathVariable int id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping(value = "/tasks/{id}")
    public ResponseEntity<Void> deleteTaskById(@PathVariable int id) {
        Optional<Task> task = taskService.getTaskById(id);
        if (task.isPresent()) {
            taskService.deleteTaskById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    
    @GetMapping(value = "/sprint/{sprintId}/productivity")
    public ResponseEntity<Map<String, Double>> getWeightedProductivityBySprint(@PathVariable int sprintId) {
        Map<String, Double> productivity = taskService.calculateWeightedProductivityBySprint(sprintId);
        return new ResponseEntity<>(productivity, HttpStatus.OK);
    }

    @GetMapping(value = "/sprint/{sprintId}/effectiveness")
    public ResponseEntity<Map<String, Double>> getEffectivenessBySprint(@PathVariable int sprintId) {
        Map<String, Double> effectiveness = taskService.calculateEffectivenessBySprint(sprintId);
        return new ResponseEntity<>(effectiveness, HttpStatus.OK);
    }

    @GetMapping(value = "/tasks/details/{id}")
    public ResponseEntity<Map<String, Object>> getTaskDetailsWithAssignedUser(@PathVariable int id) {
        Optional<Task> taskOptional = taskService.getTaskById(id);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", task.getId());
            response.put("name", task.getName());
            response.put("description", task.getDescription());
            response.put("difficulty", task.getDifficulty());
            response.put("priority", task.getPriority());
            response.put("state", task.getState());
            response.put("sprintId", task.getSprintId());
            response.put("expectedHours", task.getExpectedHours());
            response.put("actualHours", task.getActualHours());
            response.put("dueDate", task.getDueDate());
            response.put("assignedUserName", task.getoracleUserId() != 0 
                ? userService.getUserNameById(task.getoracleUserId()) 
                : "No asignado");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
}