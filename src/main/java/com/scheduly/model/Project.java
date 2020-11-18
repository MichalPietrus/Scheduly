package com.scheduly.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private long sequence;
    @Size(max = 35)
    @NotNull
    private String title;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private User user;
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ProjectTask> projectTasks;

    private void addProjectTask(ProjectTask projectTask) {
        projectTasks.add(projectTask);
        projectTask.setProject(this);
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", projectTasks=" + projectTasks +
                '}';
    }
}
