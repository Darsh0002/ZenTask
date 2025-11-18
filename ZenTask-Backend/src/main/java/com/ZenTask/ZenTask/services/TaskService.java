package com.ZenTask.ZenTask.services;

import com.ZenTask.ZenTask.Entities.Task;
import com.ZenTask.ZenTask.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepo taskRepo;

    // Get tasks for a user
    public List<Task> getTasksByUserId(Long userId) {
        return taskRepo.findAllByUserId(userId);
    }

    public Task createTask(Task task) {
        if (task.getDueDate() == null) {
            task.setDueDate(LocalDate.now()); // Use today's date
        }
        return taskRepo.save(task);
    }

    public Task getTaskById(Long taskId) {
        return taskRepo.findById(taskId).orElse(null);
    }

    public Task saveTask(Task task) {
        return taskRepo.save(task);
    }

    public boolean deleteTask(Long taskId) {
        if (taskRepo.existsById(taskId)) {
            taskRepo.deleteById(taskId);
            return true;
        }
        return false;
    }


}
