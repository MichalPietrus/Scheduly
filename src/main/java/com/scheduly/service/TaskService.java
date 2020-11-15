package com.scheduly.service;

import com.scheduly.model.Task;
import com.scheduly.pojo.TaskPojo;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskService {

    List<Task> findAllTasks();

    Task findTaskById(Long id);

    Task saveTask(Task task);

    Task findTaskByHighestSequence();

    void setPriority(String priority, Task taskModel);

    void setStatus(String status, Task taskModel);

    Task findBySequence(long sequenceId);

    List<Task> findTop15ByOrderBySequenceDesc();

    List<Task> findFirstLowerElementThan(long sequenceId);

    void removeBySequence(long id);

    void updateSequenceAfterDelete(long sequenceId);

    List<Task> findAllTasksByKeyword(String keyword);

    void removeById(long id);


}
