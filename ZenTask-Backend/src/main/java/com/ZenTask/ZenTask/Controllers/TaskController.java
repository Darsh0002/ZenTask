package com.ZenTask.ZenTask.Controllers;

import com.ZenTask.ZenTask.DTOs.TaskDTO;
import com.ZenTask.ZenTask.Entities.Task;
import com.ZenTask.ZenTask.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class TaskController {

    @Autowired
    TaskService taskService;

    @GetMapping("api/tasks/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksByUser(@PathVariable Long userId) {
        List<TaskDTO> list = taskService.getTasksByUserId(userId).stream()
                .map(TaskDTO::new)
                .toList();

        return ResponseEntity.ok().body(list);
    }

    @PostMapping("/api/new-task")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        Task savedTask = taskService.createTask(task);
        return ResponseEntity.ok(savedTask);
    }

    @PatchMapping("/api/tasks/status/{taskId}")
    public ResponseEntity<?> toggleStatus(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> requestBody) {

        String updatedStatus = requestBody.get("status");
        if (updatedStatus == null) {
            return ResponseEntity.badRequest().body("Missing 'status' field");
        }

        Task task = taskService.getTaskById(taskId);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        task.setStatus(updatedStatus);
        taskService.saveTask(task); // ✅ persist the change

        return ResponseEntity.ok(task); // send updated task back as JSON
    }

    @DeleteMapping("/api/tasks/delete/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        boolean deleted = taskService.deleteTask(taskId);

        if (!deleted) return ResponseEntity.notFound().build();

        return ResponseEntity.ok("Task deleted successfully");
    }

    @PutMapping("/api/tasks/edit/{taskId}")
    public ResponseEntity<?> editTask(
            @PathVariable Long taskId,
            @RequestBody Task updatedTask) {

        Task existing = taskService.getTaskById(taskId);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Update allowed fields
        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setDueDate(updatedTask.getDueDate());
        existing.setStatus(updatedTask.getStatus());

        Task saved = taskService.saveTask(existing);
        return ResponseEntity.ok(saved);
    }

}
