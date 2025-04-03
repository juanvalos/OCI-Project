package com.springboot.MyTodoList.util;

public enum BotCommands {

    START_COMMAND("/start"), 
    VIEW_SPRINTS("/viewsprints"), 
    VIEW_TASKS("/viewtasks"), // Mantener este comando
    CREATE_SPRINT("/createsprint"),
    CREATE_TASK("/createtask");

    private String command;

    BotCommands(String enumCommand) {
        this.command = enumCommand;
    }

    public String getCommand() {
        return command;
    }
}
