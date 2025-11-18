package com.ZenTask.ZenTask.repo;

import com.ZenTask.ZenTask.Entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepo extends JpaRepository<Task,Long> {
    // Custom query method to find tasks by user ID
    List<Task> findAllByUserId(Long userId);
}
