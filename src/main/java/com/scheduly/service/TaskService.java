package com.scheduly.service;

import com.scheduly.model.Task;
import com.scheduly.pojo.TaskPojo;

import java.util.List;

public interface TaskService {

    List<Task> findAllTasks();

    Task findTaskById(Long id);

    Task saveTask(Task task);

    Task findTaskByHighestSequence();

    void setPriority(String priority, Task taskModel);

    void setStatus(String status, Task taskModel);

    Task findBySequence(long sequenceId);

}
