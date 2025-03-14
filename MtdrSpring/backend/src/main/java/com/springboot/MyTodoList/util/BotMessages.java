package com.springboot.MyTodoList.util;

public enum BotMessages {
    
    HELLO_MYTODO_BOT("Hello! I'm MyTodoList Bot!\nSelect an option below:"),
    BOT_REGISTERED_STARTED("Bot registered and started successfully!"),
    BYE("Bye! Select /start to resume!"),
    VIEW_SPRINTS_MESSAGE("Here are the sprints:"),
    VIEW_TASKS_MESSAGE("Here are the tasks:");

    private String message;

    BotMessages(String enumMessage) {
        this.message = enumMessage;
    }

    public String getMessage() {
        return message;
    }
}
