package com.springboot.MyTodoList.util;

public enum BotLabels {
    
    VIEW_SPRINTS("View Sprints"), // Mantener esta etiqueta
    VIEW_TASKS("View Tasks"), // Mantener esta etiqueta
    CREATE_SPRINT("Create Sprint"),
    CREATE_TASK("Create Task");

    private String label;

    BotLabels(String enumLabel) {
        this.label = enumLabel;
    }

    public String getLabel() {
        return label;
    }

}
