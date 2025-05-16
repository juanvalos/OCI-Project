package com.example.bot;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
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


@ExtendWith(MockitoExtension.class)
public class CreateSprintTest {

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
    private ArgumentCaptor<Sprint> sprintArgumentCaptor;

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
    void onUpdateReceived_createsSprintSuccessfully() throws TelegramApiException {
        String sprintCommand = "New sprint: Test Sprint,Test Description,Test Project,2025-10-01";
        mockIncomingMessageText(sprintCommand);

        Sprint expectedSprint = new Sprint("Test Sprint", "Test Description", "Test Project", java.util.Date.from(LocalDate.of(2025, 10, 1).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        when(sprintService.saveSprint(Mockito.any(Sprint.class))).thenReturn(expectedSprint);

        toDoItemBotController.onUpdateReceived(update);

        verify(sprintService).saveSprint(sprintArgumentCaptor.capture());
        Sprint capturedSprint = sprintArgumentCaptor.getValue();

        assertEquals("Test Sprint", capturedSprint.getName());
        assertEquals("Test Description", capturedSprint.getDescription());
        assertEquals("Test Project", capturedSprint.getProject());
        assertEquals(java.util.Date.from(LocalDate.of(2025, 10, 1).atStartOfDay(ZoneId.systemDefault()).toInstant()), capturedSprint.getDueDate());

        verify(toDoItemBotController).execute(sendMessageCaptor.capture());
        SendMessage response = sendMessageCaptor.getValue();
        assertEquals(String.valueOf(CHAT_ID), response.getChatId());
        assertEquals(BotMessages.SPRINT_CREATED.getMessage(), response.getText());
    }

    @Test
    void onUpdateReceived_invalidSprintFormat_sendsErrorMessage() throws TelegramApiException {
        // Only 3 fields instead of 4
        String badSprintCommand = "New sprint: Incomplete Sprint,Missing Description,ProjectOnly";
        mockIncomingMessageText(badSprintCommand);

        toDoItemBotController.onUpdateReceived(update);

        // Should not try to save anything
        verify(sprintService, never()).saveSprint(Mockito.any());

        // Should send an invalid format message
        verify(toDoItemBotController).execute(sendMessageCaptor.capture());
        SendMessage response = sendMessageCaptor.getValue();
        assertEquals(String.valueOf(CHAT_ID), response.getChatId());
        assertEquals(BotMessages.INVALID_SPRINT_DETAILS.getMessage(), response.getText());
    }


    
}
