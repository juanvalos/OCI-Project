package com.springboot.MyTodoList.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
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
            } else {
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

        KeyboardRow row = new KeyboardRow();
        row.add(BotLabels.VIEW_SPRINTS.getLabel());
        row.add(BotLabels.CREATE_SPRINT.getLabel());
        row.add(BotLabels.CREATE_TASK.getLabel());
        keyboard.add(row);

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
            sprintsMessage.append("Name: ").append(sprint.getName()).append("\n")
                          .append("Description: ").append(sprint.getDescription()).append("\n")
                          .append("Project: ").append(sprint.getProject()).append("\n\n");
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
                tasksMessage.append("Name: ").append(task.getName()).append("\n")
                            .append("Description: ").append(task.getDescription()).append("\n")
                            .append("Difficulty: ").append(task.getDifficulty()).append("\n")
                            .append("Priority: ").append(task.getPriority()).append("\n")
                            .append("State: ").append(task.getState()).append("\n\n");
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
        if (details.length == 3) {
            Sprint sprint = new Sprint(details[0].trim(), details[1].trim(), details[2].trim());
            sprintService.saveSprint(sprint);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.SPRINT_CREATED.getMessage(), this);
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_SPRINT_DETAILS.getMessage(), this);
        }
    }

    private void handleNewTask(long chatId, String taskDetails) {
        String[] details = taskDetails.split(",");
        if (details.length == 5) {
            String taskName = details[0].trim();
            String description = details[1].trim();
            String difficulty = details[2].trim();
            String priority = details[3].trim();
            String state = details[4].trim();
            int expectedHours = Integer.parseInt(details[5].trim());
            int actualHours = Integer.parseInt(details[6].trim());
            LocalDate dueDate = LocalDate.parse(details[7], DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            Optional<Integer> sprintId = sprintService.getCurrentSprintId(chatId);
            Optional<Integer> userId = authService.getCurrentUserId(chatId);

            if (sprintId.isPresent() && userId.isPresent()) {
                Task task = new Task(taskName, description, difficulty, priority, state, sprintId.get(), userId.get(), expectedHours, actualHours, java.sql.Date.valueOf(dueDate));
                taskService.saveTask(task);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATED_SUCCESSFULLY.getMessage(), this);
            } else {
                BotHelper.sendMessageToTelegram(chatId, BotMessages.NO_SPRINT_OR_USER_SELECTED.getMessage(), this);
            }
        } else {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_TASK_DETAILS.getMessage(), this);
        }
    }

    @Override
    public String getBotUsername() {        
        return botName;
    }
}