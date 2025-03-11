package com.springboot.MyTodoList.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "TASKS")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DIFFICULTY")
    private String difficulty;

    @Column(name = "PRIORITY")
    private String priority;

    @Column(name = "STATE")
    private String state;

    @Column(name = "SPRINTID")
    private int sprintId;

    @Column(name = "ORACLE_USERID")
    private int oracleUserId;

    public Task() {
    }

    public Task(String name, String description, String difficulty, String priority, String state, int sprintId, int oracleUserId) {
        this.name = name;
        this.description = description;
        this.difficulty = difficulty;
        this.priority = priority;
        this.state = state;
        this.sprintId = sprintId;
        this.oracleUserId = oracleUserId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getSprintId() {
        return sprintId;
    }

    public void setSprintId(int sprintId) {
        this.sprintId = sprintId;
    }

    public int getoracleUserId () {
        return oracleUserId;
    }

    public void setoracleUserId (int oracleUserId) {
        this.oracleUserId = oracleUserId;
    }
}