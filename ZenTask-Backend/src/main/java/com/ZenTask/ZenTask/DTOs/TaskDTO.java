package com.ZenTask.ZenTask.DTOs;

import com.ZenTask.ZenTask.Entities.Task;

import java.time.LocalDate;

// Task DTO
public class TaskDTO {
    public Long id;
    public String title;
    public String status;
    public String description;
    public LocalDate dueDate;

    public TaskDTO(Task t) {
        this.id = t.getId();
        this.title = t.getTitle();
        this.status = t.getStatus();
        this.description = t.getDescription();
        this.dueDate = t.getDueDate();
    }
}
