package com.springboot.MyTodoList.controller;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException; 

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.AuthService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;



public class ToDoItemBotController extends TelegramLongPollingBot {

    private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
    private SprintService sprintService;
    private TaskService taskService;
    private AuthService authService;
    private String botName;

    public ToDoItemBotController(String botToken, String botName, SprintService sprintService, TaskService taskService, AuthService authService) {
        super(botToken);
        logger.info("Bot Token: " + botToken);
        logger.info("Bot name: " + botName);
        this.sprintService = sprintService;
        this.taskService = taskService;
        this.authService = authService;
        this.botName = botName;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageTextFromTelegram = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())) {
                showMainMenu(chatId);
            } else if (messageTextFromTelegram.equals(BotLabels.VIEW_SPRINTS.getLabel())) {
                handleViewSprints(chatId);
            } else if (messageTextFromTelegram.equals(BotLabels.CREATE_SPRINT.getLabel())) {
                BotHelper.sendMessageToTelegram(chatId, BotMessages.ENTER_SPRINT_DETAILS.getMessage(), this);
            } else if (messageTextFromTelegram.equals(BotLabels.CREATE_TASK.getLabel())) {
                handleCreateTask(chatId);
            } else if (messageTextFromTelegram.startsWith("Sprint: ")) {
                handleViewTasksBySprint(chatId, messageTextFromTelegram.replace("Sprint: ", ""));
            } else if (messageTextFromTelegram.startsWith("New sprint: ")) {
                handleCreateSprint(chatId, messageTextFromTelegram.replace("New sprint: ", ""));
            } else if (messageTextFromTelegram.startsWith("Sprint name: ")) {
                handleCreateTaskForSprint(chatId, messageTextFromTelegram.replace("Sprint name: ", ""));
            } else if (messageTextFromTelegram.startsWith("Task: ")) {
                handleNewTask(chatId, messageTextFromTelegram.replace("Task: ", ""));
            } else if (messageTextFromTelegram.startsWith("User: ")) {
                handleAssignUserToTask(chatId, messageTextFromTelegram.replace("User: ", ""));
            } else if (messageTextFromTelegram.equals("Análisis de Equipo")) {
                handleTeamAnalysis(chatId);
            } else if (messageTextFromTelegram.startsWith("Sprint analysis: ")) {
                handleSprintSelectionForAnalysis(chatId, messageTextFromTelegram.replace("Sprint analysis: ", ""));
            } else if (messageTextFromTelegram.equalsIgnoreCase("Productivity") || 
                       messageTextFromTelegram.equalsIgnoreCase("Effectiveness")) {
                handleAnalysisTypeSelection(chatId, messageTextFromTelegram);
            }else {
                BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_OPTION.getMessage(), this);
            }
        }
    }

    private void showMainMenu(long chatId) {
        SendMessage messageToTelegram = new SendMessage();
        messageToTelegram.setChatId(chatId);
        messageToTelegram.setText(BotMessages.MAIN_MENU.getMessage());
    
        ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
        List<KeyboardRow> keyboard = new ArrayList<>();
    
        KeyboardRow row1 = new KeyboardRow();
        row1.add(BotLabels.VIEW_SPRINTS.getLabel());
        row1.add(BotLabels.CREATE_SPRINT.getLabel());
        row1.add(BotLabels.CREATE_TASK.getLabel());
    
        KeyboardRow row2 = new KeyboardRow();
        row2.add("Análisis de Equipo"); // Nueva opción para análisis de equipo
    
        keyboard.add(row1);
        keyboard.add(row2);
    
        keyboardMarkup.setKeyboard(keyboard);
        messageToTelegram.setReplyMarkup(keyboardMarkup);
    
        try {
            execute(messageToTelegram);
        } catch (TelegramApiException e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }

    private void handleViewSprints(long chatId) {
        List<Sprint> sprints = sprintService.findAllSprints();
        StringBuilder sprintsMessage = new StringBuilder(BotMessages.VIEW_SPRINTS_MESSAGE.getMessage() + "\n\n");

        for (Sprint sprint : sprints) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String formattedDate = (sprint.getDueDate() != null) ? 
            sprint.getDueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter) : "No especificado";


            sprintsMessage.append("Name: ").append(sprint.getName()).append("\n")
                          .append("Description: ").append(sprint.getDescription()).append("\n")
                          .append("Project: ").append(sprint.getProject()).append("\n")
                          .append("Due Date: ").append(formattedDate).append("\n\n");
        }

        sprintsMessage.append(BotMessages.SELECT_SPRINT.getMessage());
        BotHelper.sendMessageToTelegram(chatId, sprintsMessage.toString(), this);
    }

    private void handleViewTasksBySprint(long chatId, String sprintName) {
        Optional<Integer> sprintId = sprintService.findSprintIdByName(sprintName);
        if (sprintId.isPresent()) {
            List<Task> tasks = taskService.getTasksBySprintId(sprintId.get());
            StringBuilder tasksMessage = new StringBuilder(BotMessages.VIEW_TASKS_MESSAGE.getMessage() + "\n\n");

            for (Task task : tasks) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                String formattedDate = (task.getDueDate() != null) ? 
                    task.getDueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().format(formatter) : "No especificado";

                tasksMessage.append("Name: ").append(task.getName()).append("\n")
                            .append("Description: ").append(task.getDescription()).append("\n")
                            .append("Difficulty: ").append(task.getDifficulty()).append("\n")
                            .append("Priority: ").append(task.getPriority()).append("\n")
                            .append("State: ").append(task.getState()).append("\n")
                            .append("Expected Hours: ").append(task.getExpectedHours()).append("\n")
                            .append("Actual Hours: ").append(task.getActualHours()).append("\n")
                            .append("Due Date: ").append(formattedDate).append("\n\n");
            }

            BotHelper.sendMessageToTelegram(chatId, tasksMessage.toString(), this);
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.SPRINT_NOT_FOUND.getMessage(), this);
        }
    }

    private void handleCreateTask(long chatId) {
        List<Sprint> sprints = sprintService.findAllSprints();
        StringBuilder sprintsMessage = new StringBuilder(BotMessages.SELECT_SPRINT_FOR_TASK.getMessage() + "\n\n");

        for (Sprint sprint : sprints) {
            sprintsMessage.append(sprint.getName()).append("\n");
        }

        BotHelper.sendMessageToTelegram(chatId, sprintsMessage.toString(), this);
    }

    private void handleCreateTaskForSprint(long chatId, String sprintName) {
        Optional<Integer> sprintId = sprintService.findSprintIdByName(sprintName);
        if (sprintId.isPresent()) {
            sprintService.setCurrentSprintId(chatId, sprintId.get());

            List<User> users = authService.getAllUsers();
            StringBuilder usersMessage = new StringBuilder(BotMessages.SELECT_USER_FOR_TASK.getMessage() + "\n\n");

            for (User user : users) {
                usersMessage.append(user.getName()).append("\n");
            }

            BotHelper.sendMessageToTelegram(chatId, usersMessage.toString(), this);
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.SPRINT_NOT_FOUND.getMessage(), this);
        }
    }

    private void handleAssignUserToTask(long chatId, String userName) {
        Optional<User> user = authService.getAllUsers().stream()
                .filter(u -> u.getName().equalsIgnoreCase(userName))
                .findFirst();

        if (user.isPresent()) {
            authService.setCurrentUserId(chatId, user.get().getId());

            BotHelper.sendMessageToTelegram(chatId, BotMessages.ENTER_TASK_DETAILS.getMessage(), this);
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.USER_NOT_FOUND.getMessage(), this);
        }
    }

    private void handleCreateSprint(long chatId, String sprintDetails) {
        String[] details = sprintDetails.split(",");
        if (details.length == 4) { 
            String name = details[0].trim();
            String description = details[1].trim();
            String project = details[2].trim();
            java.sql.Date dueDate = java.sql.Date.valueOf(details[3].trim());

            Sprint sprint = new Sprint(name, description, project, dueDate);
            sprintService.saveSprint(sprint);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.SPRINT_CREATED.getMessage(), this);
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_SPRINT_DETAILS.getMessage(), this);
        }
    }

    private void handleNewTask(long chatId, String taskDetails) {
        String[] details = taskDetails.split(",");
        if (details.length == 8) {
            String taskName = details[0].trim();
            String description = details[1].trim();
            String difficulty = details[2].trim();
            String priority = details[3].trim();
            String state = details[4].trim();
            Float expectedHours = Float.parseFloat(details[5].trim());
            Float actualHours = Float.parseFloat(details[6].trim());
            java.sql.Date dueDate = java.sql.Date.valueOf(details[7].trim());

            Optional<Integer> sprintId = sprintService.getCurrentSprintId(chatId);
            Optional<Integer> userId = authService.getCurrentUserId(chatId);

            if (sprintId.isPresent() && userId.isPresent()) {
                Task task = new Task(taskName, description, difficulty, priority, state, sprintId.get(), userId.get(), expectedHours, actualHours, dueDate);
                taskService.saveTask(task);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATED_SUCCESSFULLY.getMessage(), this);
            } else {
                BotHelper.sendMessageToTelegram(chatId, BotMessages.NO_SPRINT_OR_USER_SELECTED.getMessage(), this);
            }
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_TASK_DETAILS.getMessage(), this);
        }
    }

    private void handleTeamAnalysis(long chatId) {
        List<Sprint> sprints = sprintService.findAllSprints();
        StringBuilder sprintsMessage = new StringBuilder("Selecciona un a sprint to analize it. Use the next format -> Sprint analysis : [Sprint's name]:\n\n");
    
        for (Sprint sprint : sprints) {
            sprintsMessage.append(sprint.getName()).append("\n");
        }
    
        BotHelper.sendMessageToTelegram(chatId, sprintsMessage.toString(), this);
    }

    private void handleAnalysisTypeSelection(long chatId, String analysisType) {
        Optional<Integer> sprintId = sprintService.getCurrentSprintId(chatId);
    
        if (sprintId.isPresent()) {
            if (analysisType.equalsIgnoreCase("Productivity")) {
                Map<String, Double> productivity = taskService.calculateWeightedProductivityBySprint(sprintId.get());
                StringBuilder message = new StringBuilder("Users productivity:\n\n");
    
                for (Map.Entry<String, Double> entry : productivity.entrySet()) {
                    message.append(entry.getKey()).append(": ").append(entry.getValue().toString()).append("%\n");
                }
    
                BotHelper.sendMessageToTelegram(chatId, message.toString(), this);
    
            } else if (analysisType.equalsIgnoreCase("Effectiveness")) {
                Map<String, Double> effectiveness = taskService.calculateEffectivenessBySprint(sprintId.get());
                StringBuilder message = new StringBuilder("Users effectiveness:\n\n");
    
                for (Map.Entry<String, Double> entry : effectiveness.entrySet()) {
                    message.append(entry.getKey()).append(": ").append(entry.getValue().toString()).append("%\n");
                }
    
                BotHelper.sendMessageToTelegram(chatId, message.toString(), this);
    
            } else {
                BotHelper.sendMessageToTelegram(chatId, "Opción inválida. Por favor selecciona 'Productividad' o 'Efectividad'.", this);
            }
        } else {
            BotHelper.sendMessageToTelegram(chatId, "No se ha seleccionado un sprint válido. Intenta nuevamente.", this);
        }
    }

    private void handleSprintSelectionForAnalysis(long chatId, String sprintName) {
        Optional<Integer> sprintId = sprintService.findSprintIdByName(sprintName);
        if (sprintId.isPresent()) {
            sprintService.setCurrentSprintId(chatId, sprintId.get());
    
            String message = "\n\n" +
                             "1. Productivity\n" +
                             "2. Effectiveness\n" ;
    
            BotHelper.sendMessageToTelegram(chatId, message, this);
        } else {
            BotHelper.sendMessageToTelegram(chatId, "Sprint no encontrado. Intenta nuevamente.", this);
        }
    }

    @Override
    public String getBotUsername() {        
        return botName;
    }
}