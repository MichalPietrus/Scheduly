package com.scheduly.service;

import com.scheduly.model.ProjectTask;


public interface ProjectTaskService {

    ProjectTask saveProjectTask(ProjectTask projectTask);

    void setProjectTaskPriority(String priority, ProjectTask projectTask);

    void setProjectTaskStatus(String status, ProjectTask projectTask);

    void removeProjectTaskById(long id);

    void updateSequenceAfterDelete(long sequenceId, long projectId);

}
