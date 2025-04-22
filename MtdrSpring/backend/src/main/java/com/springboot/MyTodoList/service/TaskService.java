package com.springboot.MyTodoList.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getTasksByOracleUserId(int oracleUserId) {
        return taskRepository.findByOracleUserId (oracleUserId); // Ajusta el método llamado
    }

    public List<Task> getTasksBySprintId(int sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public int calculateCompletionPercentage(int oracleUserId) {
        int totalTasks = taskRepository.countByOracleUserId(oracleUserId);
        int completedTasks = taskRepository.countByOracleUserIdAndStateTerminada(oracleUserId);

        if (totalTasks == 0) {
            return 0;
        }

        return (completedTasks * 100) / totalTasks;
    }

    public List<Task> getTasksByOracleUserIdAndSprintId(int oracleUserId, int sprintId) {
        return taskRepository.findByOracleUserIdAndSprintId(oracleUserId, sprintId);
    }

    public Task updateTaskState(int id, String newState) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setState(newState);
            return taskRepository.save(task);
        } else {
            return null;
        }
    }

    public Task updateTaskHours(int id, Integer actualHours) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setActualHours(actualHours);
            return taskRepository.save(task);
        }
        return null;
    }

    public Optional<Task> getTaskById(int id) {
        return taskRepository.findById(id);
    }

    public void deleteTaskById(int id) {
        taskRepository.deleteById(id);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

}


