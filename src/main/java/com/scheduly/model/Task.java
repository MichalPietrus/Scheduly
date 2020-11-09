package com.scheduly.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Size(max = 35)
    @NotNull
    private String title;
    @DateTimeFormat(pattern = "dd.MM.yyyy HH:mm:ss")
    private LocalDateTime fromDate;
    @DateTimeFormat(pattern = "dd.MM.yyyy HH:mm:ss")
    private LocalDateTime toDate;
    private String description;
    private Status status;
    private Priority priority;
    private long sequence;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private User user;

}
