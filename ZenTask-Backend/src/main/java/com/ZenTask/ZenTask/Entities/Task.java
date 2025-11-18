package com.ZenTask.ZenTask.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String title;

    String description;

    String status; // Pending, Completed

    @Column(name = "user_id", nullable = false)
    private Long userId; // Store only user ID

    // Added dueDate field
    @Column(name = "due_date")
    private LocalDate dueDate;
}
