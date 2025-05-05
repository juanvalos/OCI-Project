package com.springboot.MyTodoList.util;

public enum BotMessages {

    MAIN_MENU("Welcome! Choose an option:"),
    VIEW_SPRINTS_MESSAGE("Here are the sprints:"),
    VIEW_TASKS_MESSAGE("Tasks del sprint:"),
    SELECT_SPRINT("Please type the name of the sprint you want to view tasks for. Use the next format -> Sprint: <sprint_name>"),
    SELECT_SPRINT_FOR_TASK("Please type the name of the sprint to add a task to. Use the next format ->  Sprint name: <sprint_name>"),
    ENTER_TASK_DETAILS("Please enter the task details in the next format -> Task: [Name], [Description], [Difficulty (Alta/Media/Baja)], [Priority (Alta/Media/Baja)], [State (Sin empezar/En proceso/Terminada)], [Estimated hours], [Actual hours], [Due Date (YYYY-MM-DD)]."),
    ENTER_SPRINT_DETAILS("Please enter the sprint details in the next format -> New sprint: [Name], [Description], [Project(Telegram-Bot-Oracle)], [Due Date (YYYY-MM-DD)]."),
    SPRINT_CREATED("Sprint created successfully!"),
    INVALID_SPRINT_DETAILS("Invalid sprint details. Please try again."),
    SPRINT_NOT_FOUND("Sprint not found. Please try again."),
    INVALID_OPTION("Invalid option. Please try again."),
    SELECT_USER_FOR_TASK("Please select a user to assign the task to. The format has to be -> User: <user_name>"),
    TASK_CREATED_SUCCESSFULLY("The task has been created and assigned successfully."),
    INVALID_TASK_DETAILS("The task details are invalid. Please use the next format -> New task: next format -> Task: [Name], [Description], [Difficulty (Alta/Media/Baja)], [Priority (Alta/Media/Baja)], [State (Sin empezar/En proceso/Terminada)], [Horas estimadas], [Horas reales (o 0)], [Fecha límite (YYYY-MM-DD)]."),
    USER_NOT_FOUND("The specified user was not found. Please select a valid user."),
    NO_SPRINT_OR_USER_SELECTED("No valid sprint or user has been selected. Please select both before creating the task."),
    BOT_REGISTERED_STARTED("Bot registered and started successfully!"),
    TEAM_ANALYSIS("Selecciona un a sprint to analize it. Use the next format -> Sprint analysis: [Sprint's name]"),
    SELECT_ANALYSIS_TYPE("Select a type of analysis:");

    private final String message;

    BotMessages(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
