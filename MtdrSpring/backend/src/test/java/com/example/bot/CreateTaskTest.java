package com.example.bot;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.AuthService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.util.BotMessages;


@ExtendWith(MockitoExtension.class)
public class CreateTaskTest {

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
    private ArgumentCaptor<SendMessage> sendMessageCaptor;
    @Captor
    private ArgumentCaptor<Task> taskArgumentCaptor;

    private static final long CHAT_ID = 12345L;
    private static final String BOT_TOKEN = "test-token";
    private static final String BOT_NAME = "TestBot";

    ToDoItemBotController toDoItemBotController;


    @BeforeEach
    void setUp() throws TelegramApiException {
        ToDoItemBotController botInstance = new ToDoItemBotController(BOT_TOKEN, BOT_NAME, sprintService, taskService, authService);
        toDoItemBotController = Mockito.spy(botInstance);


        when(update.hasMessage()).thenReturn(true);
        when(update.getMessage()).thenReturn(message);
        when(message.hasText()).thenReturn(true);
        when(message.getChatId()).thenReturn(CHAT_ID);

        
    }

    private void mockIncomingMessageText(String text) {
        when(message.getText()).thenReturn(text);
    }

    @Test
    void onUpdateReceived_handleNewTask_success() throws TelegramApiException {
        String validTaskDetails = "Deploy Feature,Complete deployment to production environment,High,Critical,In Progress,8,2,2025-12-15";
        mockIncomingMessageText("Task: " + validTaskDetails);

        int expectedSprintId = 1;
        int expectedUserId = 101;
        when(sprintService.getCurrentSprintId(CHAT_ID)).thenReturn(Optional.of(expectedSprintId));
        when(authService.getCurrentUserId(CHAT_ID)).thenReturn(Optional.of(expectedUserId));

        toDoItemBotController.onUpdateReceived(update);

        verify(taskService).saveTask(taskArgumentCaptor.capture());
        Task capturedTask = taskArgumentCaptor.getValue();

        assertEquals("Deploy Feature", capturedTask.getName());
        assertEquals("Complete deployment to production environment", capturedTask.getDescription());
        assertEquals("High", capturedTask.getDifficulty());
        assertEquals("Critical", capturedTask.getPriority());
        assertEquals("In Progress", capturedTask.getState());
        assertEquals(expectedSprintId, capturedTask.getSprintId());
        assertEquals(expectedUserId, 101);
        assertEquals(8, capturedTask.getExpectedHours());
        assertEquals(2, capturedTask.getActualHours());
        assertEquals(Date.valueOf("2025-12-15"), capturedTask.getDueDate());

        verify(toDoItemBotController).execute(sendMessageCaptor.capture());
        SendMessage sentMessage = sendMessageCaptor.getValue();
        assertEquals(String.valueOf(CHAT_ID), sentMessage.getChatId());
        // Use the actual BotMessages class here
        assertEquals(BotMessages.TASK_CREATED_SUCCESSFULLY.getMessage(), sentMessage.getText());
    }

    @Test
    void onUpdateReceived_handleNewTask_missingContext() throws TelegramApiException {
        String validTaskDetails = "Valid Task,Some Description,Medium,Medium,To Do,5,0,2026-01-01";
        mockIncomingMessageText("Task: " + validTaskDetails);

        // Scenario 1: Sprint ID is missing
        when(sprintService.getCurrentSprintId(CHAT_ID)).thenReturn(Optional.empty());
        when(authService.getCurrentUserId(CHAT_ID)).thenReturn(Optional.of(102));

        toDoItemBotController.onUpdateReceived(update);

        verify(taskService, never()).saveTask(any(Task.class));
        verify(toDoItemBotController).execute(sendMessageCaptor.capture());
        SendMessage sentMessage1 = sendMessageCaptor.getValue();
        assertEquals(String.valueOf(CHAT_ID), sentMessage1.getChatId());
        // Use the actual BotMessages class here
        assertEquals(BotMessages.NO_SPRINT_OR_USER_SELECTED.getMessage(), sentMessage1.getText());

        clearInvocations(toDoItemBotController);

        // Scenario 2: User ID is missing
        when(sprintService.getCurrentSprintId(CHAT_ID)).thenReturn(Optional.of(2));
        when(authService.getCurrentUserId(CHAT_ID)).thenReturn(Optional.empty());

        toDoItemBotController.onUpdateReceived(update);

        verify(taskService, never()).saveTask(any(Task.class));
        verify(toDoItemBotController).execute(sendMessageCaptor.capture());
        SendMessage sentMessage2 = sendMessageCaptor.getValue();
        assertEquals(String.valueOf(CHAT_ID), sentMessage2.getChatId());
        // Use the actual BotMessages class here
        assertEquals(BotMessages.NO_SPRINT_OR_USER_SELECTED.getMessage(), sentMessage2.getText());
        
        clearInvocations(toDoItemBotController);

        // Scenario 3: Both Sprint and User ID are missing
        when(sprintService.getCurrentSprintId(CHAT_ID)).thenReturn(Optional.empty());
        when(authService.getCurrentUserId(CHAT_ID)).thenReturn(Optional.empty());

        toDoItemBotController.onUpdateReceived(update);
        verify(taskService, never()).saveTask(any(Task.class));
        verify(toDoItemBotController).execute(sendMessageCaptor.capture());
        SendMessage sentMessage3 = sendMessageCaptor.getValue();
        // Use the actual BotMessages class here
        assertEquals(BotMessages.NO_SPRINT_OR_USER_SELECTED.getMessage(), sentMessage3.getText());
    }
    
}
