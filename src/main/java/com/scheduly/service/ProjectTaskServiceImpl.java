package com.scheduly.service;

import com.scheduly.enums.Priority;
import com.scheduly.enums.Status;
import com.scheduly.model.ProjectTask;
import com.scheduly.repository.ProjectTaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectTaskServiceImpl implements ProjectTaskService {

    private final ProjectTaskRepository projectTaskRepository;

    public ProjectTaskServiceImpl(ProjectTaskRepository projectTaskRepository) {
        this.projectTaskRepository = projectTaskRepository;
    }


    @Override
    public ProjectTask saveProjectTask(ProjectTask projectTask) {
        return projectTaskRepository.save(projectTask);
    }


    @Override
    public void setProjectTaskPriority(String priority, ProjectTask projectTask) {
        switch (priority) {
            case "LOW":
                projectTask.setPriority(Priority.LOW);
                break;
            case "MEDIUM":
                projectTask.setPriority(Priority.MEDIUM);
                break;
            case "HIGH":
                projectTask.setPriority(Priority.HIGH);
                break;
        }
    }

    @Override
    public void setProjectTaskStatus(String status, ProjectTask projectTask) {
        switch (status) {
            case "IN PROGRESS":
                projectTask.setStatus(Status.IN_PROGRESS);
                break;
            case "DONE":
                projectTask.setStatus(Status.DONE);
                break;
            case "STUCK":
                projectTask.setStatus(Status.STUCK);
                break;
        }
    }

    @Override
    public void removeProjectTaskById(long id) {
        projectTaskRepository.deleteById(id);
    }

    @Override
    public void updateSequenceAfterDelete(long sequenceId, long projectId) {
        List<ProjectTask> projectTaskList = projectTaskRepository.findAllBySequenceGreaterThanAndProjectId(sequenceId, projectId);
        for (ProjectTask projectTask : projectTaskList) {
            projectTask.setSequence(projectTask.getSequence() - 1);
        }
        projectTaskRepository.saveAll(projectTaskList);
    }
}
