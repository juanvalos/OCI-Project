package com.springboot.MyTodoList.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private AuthService userService;

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

    public Task updateTaskHours(int id, Float actualHours) {
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

    public Map<String, Double> calculateWeightedProductivityBySprint(int sprintId) {
        List<Task> tasks = taskRepository.findBySprintId(sprintId);
        Map<String, Double> userProductivity = new HashMap<>();

        Map<String, Double> difficultyWeights = Map.of(
            "Alta", 1.5,
            "Media", 1.2,
            "Baja", 1.0
        );

        Map<String, Double> priorityWeights = Map.of(
            "Alta", 1.5,
            "Media", 1.2,
            "Baja", 1.0
        );

        Map<Integer, List<Task>> tasksByUser = tasks.stream()
            .collect(Collectors.groupingBy(Task::getoracleUserId));

        for (Map.Entry<Integer, List<Task>> entry : tasksByUser.entrySet()) {
            int userId = entry.getKey();
            String userName = userService.getUserNameById(userId); 
            List<Task> userTasks = entry.getValue();

            double weightedEstimatedHours = 0.0;
            double weightedActualHours = 0.0;

            for (Task task : userTasks) {
                double difficultyWeight = difficultyWeights.getOrDefault(task.getDifficulty(), 1.0);
                double priorityWeight = priorityWeights.getOrDefault(task.getPriority(), 1.0);
                double weight = difficultyWeight * priorityWeight;

                if (task.getExpectedHours() != null && task.getActualHours() != null) {
                    weightedEstimatedHours += task.getExpectedHours() * weight;
                    weightedActualHours += task.getActualHours() * weight;
                }
            }

            double productivity = (weightedActualHours > 0)
                ? (weightedEstimatedHours / weightedActualHours) * 100
                : 0.0;

            userProductivity.put(userName, productivity);
        }

        return userProductivity;
    }

    public Map<String, Double> calculateEffectivenessBySprint(int sprintId) {
        List<Task> tasks = taskRepository.findBySprintId(sprintId);
        Map<String, Double> userEffectiveness = new HashMap<>();

        Map<String, Double> difficultyWeights = Map.of(
            "Alta", 1.5,
            "Media", 1.2,
            "Baja", 1.0
        );

        Map<String, Double> priorityWeights = Map.of(
            "Alta", 1.5,
            "Media", 1.2,
            "Baja", 1.0
        );

        Map<Integer, List<Task>> tasksByUser = tasks.stream()
            .collect(Collectors.groupingBy(Task::getoracleUserId));

        for (Map.Entry<Integer, List<Task>> entry : tasksByUser.entrySet()) {
            int userId = entry.getKey();
            String userName = userService.getUserNameById(userId); // Obtener el nombre del usuario
            List<Task> userTasks = entry.getValue();

            double totalWeight = 0.0;
            double completedWeight = 0.0;

            for (Task task : userTasks) {
                double difficultyWeight = difficultyWeights.getOrDefault(task.getDifficulty(), 1.0);
                double priorityWeight = priorityWeights.getOrDefault(task.getPriority(), 1.0);
                double weight = difficultyWeight * priorityWeight;

                totalWeight += weight;

                if ("Terminada".equalsIgnoreCase(task.getState())) {
                    completedWeight += weight;
                }
            }

            double effectiveness = (totalWeight > 0)
                ? (completedWeight / totalWeight) * 100
                : 0.0;

            userEffectiveness.put(userName, effectiveness);
        }

        return userEffectiveness;
    }

}


