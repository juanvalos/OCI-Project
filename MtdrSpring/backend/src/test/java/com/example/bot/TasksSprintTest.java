package com.example.bot;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.AuthService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.util.BotMessages;
import com.springboot.MyTodoList.util.BotHelper;
import org.mockito.MockedStatic;

@ExtendWith(MockitoExtension.class)
public class TasksSprintTest {
    @Mock
    private SprintService sprintService;
    @Mock
    private TaskService taskService;
    @Mock
    private AuthService authService;

    @Mock
    private Update update;
    @Mock
    private Message message;
    @Mock
    private Chat chat;

    @Captor
    private ArgumentCaptor<String> sendMessageCaptor;

    private MockedStatic<BotHelper> mockedBotHelper;


    private static final long CHAT_ID = 12345L;
    private static final String BOT_TOKEN = "test-token";
    private static final String BOT_NAME = "TestBot";

    ToDoItemBotController toDoItemBotController;


    @BeforeEach
    void setUp() throws TelegramApiException {
        mockedBotHelper = Mockito.mockStatic(BotHelper.class);

        ToDoItemBotController botInstance = new ToDoItemBotController(BOT_TOKEN, BOT_NAME, sprintService, taskService, authService);
        toDoItemBotController = Mockito.spy(botInstance);

        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);
        when(message.hasText()).thenReturn(true);
        when(message.getChatId()).thenReturn(CHAT_ID);

        mockedBotHelper.when(() -> BotHelper.sendMessageToTelegram(any(Long.class), any(String.class), any(ToDoItemBotController.class)))
                       .thenAnswer(invocation -> {
                           return null;
                       });
    }

    @AfterEach
    void tearDown() {
        if (mockedBotHelper != null) {
            mockedBotHelper.close();
        }
    }


    private void mockIncomingMessageText(String text) {
        when(message.getText()).thenReturn(text);
    }

    @Test
    void onUpdateReceived_viewTasksBySprint_success() throws TelegramApiException {
        String sprintName = "Alpha";
        int sprintId = 1;

        Sprint mockSprint = new Sprint();
        mockSprint.setId(sprintId);
        mockSprint.setName(sprintName);

        Task mockTask = new Task();
        mockTask.setName("Fix bug");
        mockTask.setDescription("Fix a major bug");
        mockTask.setDifficulty("Medium");
        mockTask.setPriority("High");
        mockTask.setState("To Do");
        mockTask.setExpectedHours(5);
        mockTask.setActualHours(0);
        mockTask.setDueDate(java.util.Date.from(LocalDate.of(2025, 10, 1).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        mockTask.setSprintId(sprintId);
        mockTask.setoracleUserId(101);



        List<Task> tasks = List.of(mockTask);

        String sprintSelectionInput = "Sprint: " + sprintName;
        mockIncomingMessageText(sprintSelectionInput);

        when(sprintService.findSprintIdByName(sprintName)).thenReturn(Optional.of(sprintId));
        when(taskService.getTasksBySprintId(sprintId)).thenReturn(tasks);

        toDoItemBotController.onUpdateReceived(update);

        mockedBotHelper.verify(() -> BotHelper.sendMessageToTelegram(
            Mockito.eq(CHAT_ID),
            sendMessageCaptor.capture(),
            Mockito.eq(toDoItemBotController)
        ));

        String actualText = sendMessageCaptor.getValue();
        System.out.println("Bot response: " + actualText);

        assertTrue(actualText.contains("Tasks del sprint"));
        assertTrue(actualText.contains("Name: Fix bug"));
        assertTrue(actualText.contains("Description: Fix a major bug"));
        assertTrue(actualText.contains("Difficulty: Medium"));
        assertTrue(actualText.contains("Priority: High"));
        assertTrue(actualText.contains("State: To Do"));
        assertTrue(actualText.contains("Expected Hours: 5"));
        assertTrue(actualText.contains("Actual Hours: 0"));
        assertTrue(actualText.contains("Due Date: 01/10/2025"));

    }


     @Test
     void onUpdateReceived_viewTasksBySprint_sprintNotFound() throws TelegramApiException {
         String sprintName = "NonExistentSprint";

         String sprintSelectionInput = "Sprint: " + sprintName;
         mockIncomingMessageText(sprintSelectionInput);

         when(sprintService.findSprintIdByName(sprintName)).thenReturn(Optional.empty());

         toDoItemBotController.onUpdateReceived(update);

         mockedBotHelper.verify(() -> BotHelper.sendMessageToTelegram(
             Mockito.eq(CHAT_ID),
             sendMessageCaptor.capture(),
             Mockito.eq(toDoItemBotController)
         ));

         String actualText = sendMessageCaptor.getValue();
         assertEquals(BotMessages.SPRINT_NOT_FOUND.getMessage(), actualText);
     }
}