package com.springboot.MyTodoList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.service.AuthService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.util.BotMessages;

@SpringBootApplication
public class MyTodoListApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(MyTodoListApplication.class);

    @Autowired
    private SprintService sprintService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private AuthService authService; // Inyectar AuthService

    @Value("${telegram.bot.token}")
    private String telegramBotToken;

    @Value("${telegram.bot.name}")
    private String botName;

    public static void main(String[] args) {
        SpringApplication.run(MyTodoListApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            TelegramBotsApi telegramBotsApi = new TelegramBotsApi(DefaultBotSession.class);
            telegramBotsApi.registerBot(new ToDoItemBotController(telegramBotToken, botName, sprintService, taskService, authService));
            logger.info(BotMessages.BOT_REGISTERED_STARTED.getMessage());
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}

@Configuration
class MyTodoListConfiguration {

    @Bean
    public ToDoItemBotController toDoItemBotController(SprintService sprintService, TaskService taskService, AuthService authService) {
        String botToken = "your-bot-token"; // Reemplaza con tu token
        String botName = "your-bot-name";   // Reemplaza con tu nombre de bot
        return new ToDoItemBotController(botToken, botName, sprintService, taskService, authService);
    }
}
