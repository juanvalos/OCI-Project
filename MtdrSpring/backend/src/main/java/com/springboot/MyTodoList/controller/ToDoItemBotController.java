package com.springboot.MyTodoList.controller;

import java.util.ArrayList;
import java.util.List;

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
    private String botName;

    public ToDoItemBotController(String botToken, String botName, SprintService sprintService, TaskService taskService) {
        super(botToken);
        logger.info("Bot Token: " + botToken);
        logger.info("Bot name: " + botName);
        this.sprintService = sprintService;
        this.taskService = taskService;
        this.botName = botName;
    }

    @Override
    public void onUpdateReceived(Update update) {

        if (update.hasMessage() && update.getMessage().hasText()) {

            String messageTextFromTelegram = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())) {

                SendMessage messageToTelegram = new SendMessage();
                messageToTelegram.setChatId(chatId);
                messageToTelegram.setText(BotMessages.HELLO_MYTODO_BOT.getMessage());

                ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
                List<KeyboardRow> keyboard = new ArrayList<>();

                // first row
                KeyboardRow row = new KeyboardRow();
                row.add(BotLabels.VIEW_SPRINTS.getLabel());
                row.add(BotLabels.VIEW_TASKS.getLabel());
                keyboard.add(row);

                // Set the keyboard
                keyboardMarkup.setKeyboard(keyboard);

                // Add the keyboard markup
                messageToTelegram.setReplyMarkup(keyboardMarkup);

                try {
                    execute(messageToTelegram);
                } catch (TelegramApiException e) {
                    logger.error(e.getLocalizedMessage(), e);
                }

            } else if (messageTextFromTelegram.equals(BotLabels.VIEW_SPRINTS.getLabel())) {

                List<Sprint> sprints = sprintService.findAllSprints();
                StringBuilder sprintsMessage = new StringBuilder(BotMessages.VIEW_SPRINTS_MESSAGE.getMessage() + "\n\n");

                for (Sprint sprint : sprints) {
                    sprintsMessage.append("Name: ").append(sprint.getName()).append("\n")
                                  .append("Description: ").append(sprint.getDescription()).append("\n")
                                  .append("Project: ").append(sprint.getProject()).append("\n\n");
                }

                BotHelper.sendMessageToTelegram(chatId, sprintsMessage.toString(), this);

            } else if (messageTextFromTelegram.equals(BotLabels.VIEW_TASKS.getLabel())) {

                List<Task> tasks = taskService.getAllTasks();
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
                BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), this);
            }
        }
    }

    @Override
    public String getBotUsername() {        
        return botName;
    }
}