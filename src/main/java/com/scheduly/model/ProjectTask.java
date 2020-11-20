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
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class ProjectTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Size(max = 35)
    @NotNull
    private String title;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date date;
    private int estimatedTime;
    private Status status;
    private Priority priority;
    private long sequence;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Project project;

    @Override
    public String toString() {
        return "ProjectTask{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", date=" + date +
                ", estimatedTime=" + estimatedTime +
                ", status=" + status +
                ", priority=" + priority +
                ", sequence=" + sequence +
                '}';
    }
}
