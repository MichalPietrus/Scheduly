package com.scheduly.service;

import com.scheduly.model.ProjectTask;
import com.scheduly.model.Task;


public interface ProjectTaskService {

    ProjectTask saveProjectTask(ProjectTask projectTask);

    void setProjectTaskPriority(String priority, ProjectTask projectTask);

    void setProjectTaskStatus(String status, ProjectTask projectTask);

}
