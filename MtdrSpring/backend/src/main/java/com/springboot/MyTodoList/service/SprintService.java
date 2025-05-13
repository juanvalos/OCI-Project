package com.springboot.MyTodoList.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.repository.TaskRepository;


@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private AuthService userService;

    @Autowired
    private TaskService taskService;

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

    public Map<String, Float> getTotalHoursWorkedPerSprint() {
        List<Sprint> sprints = sprintRepository.findAll();
        Map<String, Float> totalHoursPerSprint = new HashMap<>();

        for (Sprint sprint : sprints) {
            List<Task> tasks = taskService.getTasksBySprintId(sprint.getId());
            Float totalHours = (float) tasks.stream()
                                  .mapToDouble(task -> task.getActualHours() != null ? task.getActualHours() : 0)
                                  .sum();
            totalHoursPerSprint.put(sprint.getName(), totalHours);
        }

        return totalHoursPerSprint;
    }

    public List<Map<String, Object>> getTotalHoursPerUserPerSprint() {
        List<Sprint> sprints = findAllSprints();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            Map<String, Object> sprintData = new HashMap<>();
            sprintData.put("name", sprint.getName());

            List<Task> tasks = taskRepository.findBySprintId(sprint.getId());
            Map<String, Float> userHours = new HashMap<>();

            for (Task task : tasks) {
                String userName = task.getoracleUserId() != 0 
                    ? userService.getUserNameById(task.getoracleUserId()) 
                    : "No asignado";

                userHours.put(userName, userHours.getOrDefault(userName, 0.0f) + 
                    (task.getActualHours() != null ? task.getActualHours() : 0));
            }

            sprintData.putAll(userHours);
            result.add(sprintData);
        }

        return result;
    }

    public List<Map<String, Object>> getCompletedTasksPerUserPerSprint() {
        List<Sprint> sprints = findAllSprints();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Sprint sprint : sprints) {
            Map<String, Object> sprintData = new HashMap<>();
            sprintData.put("name", sprint.getName());

            List<Task> tasks = taskRepository.findBySprintId(sprint.getId());
            Map<String, Integer> userTaskCounts = new HashMap<>();

            for (Task task : tasks) {
                if ("Terminada".equalsIgnoreCase(task.getState())) {
                    String userName = task.getoracleUserId() != 0 
                        ? userService.getUserNameById(task.getoracleUserId()) 
                        : "No asignado";

                    userTaskCounts.put(userName, userTaskCounts.getOrDefault(userName, 0) + 1);
                }
            }

            sprintData.putAll(userTaskCounts);
            result.add(sprintData);
        }

        return result;
    }
}